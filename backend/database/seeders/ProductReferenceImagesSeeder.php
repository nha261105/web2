<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductReferenceImagesSeeder extends Seeder
{
    public function run(): void
    {
        $reference = config('reference_images', []);

        foreach ($reference as $slug => $urls) {
            foreach ($urls as $url) {
                DB::table('product_reference_images')->insert([
                    'slug' => $slug,
                    'source_url' => $url,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
