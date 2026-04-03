<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ComboSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $category = \App\Models\Category::firstOrCreate(['name' => 'Combo Camera', 'slug' => 'combo-camera']);
        $brand = \App\Models\Brand::firstOrCreate(['name' => 'Sony', 'logo' => '']);
        
        $p1 = \App\Models\Product::firstOrCreate(
            ['slug' => 'sony-a7-iv'],
            ['name' => 'Sony A7 IV', 'category_id' => $category->id, 'brand_id' => $brand->id, 'daily_price' => 500000, 'deposit_price' => 50000000, 'status' => 'ACTIVE', 'stock' => 5]
        );
        $p2 = \App\Models\Product::firstOrCreate(
            ['slug' => 'sony-24-70mm'],
            ['name' => 'Sony 24-70mm GM', 'category_id' => $category->id, 'brand_id' => $brand->id, 'daily_price' => 300000, 'deposit_price' => 30000000, 'status' => 'ACTIVE', 'stock' => 5]
        );

        $combo = \App\Models\Combo::firstOrCreate(
            ['slug' => 'combo-photographer-pro'],
            ['name' => 'Set Nhiếp Ảnh Gia Chuyên Nghiệp', 'description' => 'Bao gồm Sony A7 IV và Lens 24-70 GM', 'status' => 'ACTIVE']
        );

        \App\Models\ComboDetail::firstOrCreate(['combo_id' => $combo->id, 'product_id' => $p1->id], ['quantity' => 1]);
        \App\Models\ComboDetail::firstOrCreate(['combo_id' => $combo->id, 'product_id' => $p2->id], ['quantity' => 1]);
    }
}
