<?php

namespace App\Services\Combos;

use App\Models\ComboDetail;
use App\Models\Combo;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ComboService
{
    public function list(): Collection
    {
        return Combo::query()
            ->with(['comboDetails.product'])
            ->orderByDesc('id')
            ->get();
    }

    public function findById(int $id): Combo
    {
        return Combo::with(['comboDetails.product'])->findOrFail($id);
    }

    public function create(array $data): Combo
    {
        return DB::transaction(function () use ($data) {
            $combo = Combo::create([
                'name' => $data['name'],
                'daily_price' => $data['daily_price'],
                'description' => $data['description'],
            ]);

            $items = array_map(function ($item) use ($combo) {
                return [
                    'combo_id' => $combo->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ];
            }, $data['items']);
            ComboDetail::insert($items);
            return $this->findById($combo->id);
        });
    }

    public function updateById(int $id, array $data): Combo
    {
        return DB::transaction(function () use ($id, $data) {
            $combo = $this->findById($id);
            if (isset($data['name'])) {
                $combo->name = $data['name'];
            }
            if (isset($data['daily_price'])) {
                $combo->daily_price = $data['daily_price'];
            }
            if (isset($data['description'])) {
                $combo->description = $data['description'];
            }
            $combo->save();
            if (isset($data['items']) && is_array($data['items'])) {
                ComboDetail::where('combo_id', $id)->forceDelete();
                $items = array_map(function ($item) use ($id) {
                    return [
                        'combo_id' => $id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                    ];
                }, $data['items']);
                ComboDetail::insert($items);
            }
            return $this->findById($id);
        });
    }

    public function deleteById(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            ComboDetail::where('combo_id', $id)->forceDelete();
            $combo = $this->findById($id);
            return (bool) $combo->forceDelete();
        });
    }
}
