<?php

namespace Database\Seeders;

use App\Models\Combo;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ComboPresetSeeder extends Seeder
{
    public function run(): void
    {
        $presets = [
            [
                'name' => 'Combo Quay phim Cơ bản',
                'daily_price' => 900000,
                'description' =>
                    'Sony A7 III + Rode VideoMic Pro+ + DJI RS 3 Mini',
                'items' => [
                    'sony-a7-iii' => 1,
                    'rode-videomic-pro-plus' => 1,
                    'dji-rs-3-mini' => 1,
                ],
            ],
            [
                'name' => 'Combo Flycam Pro',
                'daily_price' => 850000,
                'description' => 'DJI Mavic 3 Pro + thẻ nhớ + sạc dự phòng',
                'items' => [
                    'dji-mavic-3-pro' => 1,
                ],
            ],
            [
                'name' => 'Combo Studio Ánh sáng',
                'daily_price' => 550000,
                'description' => 'Godox SL-60W x2 + chân đèn + softbox',
                'items' => [
                    'godox-sl-60w' => 2,
                ],
            ],
            [
                'name' => 'Combo Chụp ảnh Toàn diện',
                'daily_price' => 950000,
                'description' =>
                    'Canon EOS R6 Mark II + Sony FE 24-70mm f/2.8 + Godox SL-60W',
                'items' => [
                    'canon-eos-r6-mark-ii' => 1,
                    'sony-fe-24-70-f28' => 1,
                    'godox-sl-60w' => 1,
                ],
            ],
        ];

        foreach ($presets as $preset) {
            $combo = Combo::query()->updateOrCreate(
                ['name' => $preset['name']],
                [
                    'daily_price' => $preset['daily_price'],
                    'description' => $preset['description'],
                ],
            );

            $details = [];
            foreach ($preset['items'] as $slug => $qty) {
                $productId = Product::query()
                    ->where('slug', $slug)
                    ->value('id');
                if (!$productId) {
                    continue;
                }

                $details[$productId] = ['quantity' => (int) $qty];
            }

            if (!empty($details)) {
                $combo->products()->sync($details);
            }
        }
    }
}
