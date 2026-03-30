<?php

namespace App\Jobs;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use App\Services\ImageStorage\SupabaseStorage;

class PopulateProductReferenceImages implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public Product $product;

    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function handle(SupabaseStorage $storage): void
    {
        $slug = (string) $this->product->slug;
        $reference = config('reference_images', []);

        if (!isset($reference[$slug]) || empty($reference[$slug])) {
            return;
        }

        $sourceUrls = array_slice(
            array_values(array_unique($reference[$slug])),
            0,
            3,
        );
        $publicUrls = [];

        foreach ($sourceUrls as $sourceUrl) {
            try {
                $publicUrls[] = $storage->uploadFromUrl(
                    $sourceUrl,
                    'products/' . $this->product->id . '/reference',
                );
            } catch (\Throwable $e) {
                // swallow upload errors
            }
        }

        if (count($publicUrls) === 0) {
            return;
        }

        DB::transaction(function () use ($publicUrls, $sourceUrls) {
            DB::table('product_img')
                ->where('product_id', $this->product->id)
                ->delete();

            foreach ($publicUrls as $publicUrl) {
                DB::table('product_img')->insert([
                    'product_id' => $this->product->id,
                    'image_url' => $publicUrl,
                ]);
            }

            foreach ($sourceUrls as $idx => $source) {
                $public = $publicUrls[$idx] ?? null;

                $updated = DB::table('product_reference_images')
                    ->where('slug', $this->product->slug)
                    ->where('source_url', $source)
                    ->update([
                        'product_id' => $this->product->id,
                        'public_url' => $public,
                        'updated_at' => now(),
                    ]);

                if ($updated === 0) {
                    DB::table('product_reference_images')->insert([
                        'product_id' => $this->product->id,
                        'slug' => $this->product->slug,
                        'source_url' => $source,
                        'public_url' => $public,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        });
    }
}
