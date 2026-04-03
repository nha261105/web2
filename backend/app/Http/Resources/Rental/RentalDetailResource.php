<?php

namespace App\Http\Resources\Rental;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RentalDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rental_id' => $this->rental_id,
            'product_id' => $this->product_id,
            'combo_id' => $this->combo_id,
            'quantity' => $this->quantity,
            'price_at_rental' => $this->price_at_rental,
            
            // Thông tin sản phẩm (nếu loaded)
            'product' => $this->whenLoaded('product', function () {
                return [
                    'id' => $this->product->id,
                    'name' => $this->product->name,
                    'slug' => $this->product->slug,
                    'daily_price' => $this->product->daily_price,
                    'image' => $this->product->images->first()?->image_url ?? null,
                ];
            }),
            
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}