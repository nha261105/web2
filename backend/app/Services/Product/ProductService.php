<?php

namespace App\Services\Product;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class ProductService
{
    public function list(array $filters = []): Collection
    {
        return Product::query()
            ->with(['category', 'brand', 'images'])
            ->when(
                $filters['search'] ?? null,
                fn($q, $s) => $q->where('name', 'like', '%' . $s . '%'),
            )
            ->when(
                $filters['category_id'] ?? null,
                fn($q, $categoryId) => $q->where('category_id', $categoryId),
            )
            ->when(
                $filters['brand_id'] ?? null,
                fn($q, $brandId) => $q->where('brand_id', $brandId),
            )
            ->when(
                $filters['status'] ?? null,
                fn($q, $status) => $q->where('status', $status),
            )
            ->orderByDesc('id')
            ->get();
    }
    public function findById(int $id): Product
    {
        return Product::query()
            ->with(['category', 'brand', 'images'])
            ->findOrFail($id);
    }
    public function create(array $data): Product
    {
        return Product::create($data);
    }
    public function updateById(int $id, array $data): Product
    {
        $product = $this->findById($id);
        $product->update($data);
        return $product->fresh(['category', 'brand', 'images']);
    }

    public function deleteById(int $id): bool
    {
        $product = $this->findById($id);
        return (bool) $product->delete();
    }
}
