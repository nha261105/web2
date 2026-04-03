<?php

namespace App\Http\Resources;

use App\Services\ImageStorage\SupabaseStorage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'brand_id' => $this->brand_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'daily_price' => $this->daily_price,
            'deposit_price' => $this->deposit_price,
            'description' => $this->description,
            'status' => $this->status,
            'stock' =>
                (int) ($this->stock ??
                    $this->inventories()
                        ->where('status', 'AVAILABLE')
                        ->whereNull('deleted_at')
                        ->count()),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'brand' => new BrandResource($this->whenLoaded('brand')),
            'images' => $this->whenLoaded(
                'images',
                function () {
                    $storage = app(SupabaseStorage::class);

                    return $this->images
                        ->pluck('image_url')
                        ->map(
                            fn($url) => $storage->toAccessibleUrl(
                                (string) $url,
                                86400,
                            ),
                        )
                        ->values();
                },
                [],
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
