<?php

use App\Services\ImageStorage\SupabaseStorage;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('products:migrate-images-to-supabase', function () {
    /** @var SupabaseStorage $storage */
    $storage = app(SupabaseStorage::class);

    $rows = DB::table('product_img')
        ->select('id', 'product_id', 'image_url')
        ->get();
    $updated = 0;
    $skipped = 0;

    foreach ($rows as $row) {
        if (
            str_contains(
                (string) $row->image_url,
                'supabase.co/storage/v1/object/public/',
            )
        ) {
            $skipped++;
            continue;
        }

        try {
            $newUrl = $storage->uploadFromUrl(
                (string) $row->image_url,
                'products/migrated',
            );

            DB::table('product_img')
                ->where('id', $row->id)
                ->update(['image_url' => $newUrl]);

            $updated++;
            $this->line("updated #{$row->id} (product {$row->product_id})");
        } catch (\Throwable $e) {
            $this->error("failed #{$row->id}: {$e->getMessage()}");
        }
    }

    $this->info(
        "Done. Updated: {$updated}, skipped: {$skipped}, total: {$rows->count()}",
    );
})->purpose(
    'Upload non-Supabase product images to Supabase and update product_img URLs',
);

Artisan::command('products:sync-reference-images', function () {
    /** @var SupabaseStorage $storage */
    $storage = app(SupabaseStorage::class);

    $referenceImages = config('reference_images', []);

    $products = DB::table('products')->select('id', 'slug')->get();
    $syncedProducts = 0;
    $uploadedImages = 0;

    foreach ($products as $product) {
        $slug = (string) $product->slug;

        if (!isset($referenceImages[$slug])) {
            $this->warn("skip {$slug}: no reference images");
            continue;
        }

        $sourceUrls = array_slice(
            array_values(array_unique($referenceImages[$slug])),
            0,
            3,
        );
        $publicUrls = [];

        foreach ($sourceUrls as $sourceUrl) {
            try {
                $publicUrls[] = $storage->uploadFromUrl(
                    $sourceUrl,
                    'products/' . $product->id . '/reference',
                );
            } catch (\Throwable $e) {
                $this->error(
                    "upload failed {$slug}: {$sourceUrl} => {$e->getMessage()}",
                );
            }
        }

        if (count($publicUrls) === 0) {
            $this->error("skip {$slug}: no image uploaded");
            continue;
        }

        DB::transaction(function () use ($product, $publicUrls) {
            DB::table('product_img')
                ->where('product_id', $product->id)
                ->delete();

            foreach ($publicUrls as $publicUrl) {
                DB::table('product_img')->insert([
                    'product_id' => $product->id,
                    'image_url' => $publicUrl,
                ]);
            }
        });

        $syncedProducts++;
        $uploadedImages += count($publicUrls);
        $this->line("synced {$slug}: " . count($publicUrls) . ' image(s)');
    }

    $this->info(
        "Done. Synced products: {$syncedProducts}, uploaded images: {$uploadedImages}",
    );
})->purpose(
    'Assign 1-3 reference images per product and store them in Supabase',
);
