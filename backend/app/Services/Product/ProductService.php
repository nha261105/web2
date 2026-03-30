<?php

namespace App\Services\Product;

use App\Models\ProductImage;
use App\Services\ImageStorage\SupabaseStorage;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function __construct(private SupabaseStorage $storage) {}
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
        return DB::transaction(function () use ($data) {
            $imageUrls = $data['image_source_urls'] ?? [];
            unset($data['image_source_urls']);

            $product = Product::create($data);

            foreach ($imageUrls as $rawUrl) {
                $publicUrl = $this->storage->uploadFromUrl(
                    $rawUrl,
                    'products/' . $product->id,
                );

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $publicUrl,
                ]);
            }

            return $product->fresh(['category', 'brand', 'images']);
        });
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
