<?php

namespace App\Http\Resources\Rental;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RentalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'coupon_id' => $this->coupon_id,
            'address_id' => $this->address_id,
            'code' => $this->code,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'actual_return_date' => $this->actual_return_date,
            'total_price' => $this->total_price,
            'deposit_amount' => $this->deposit_amount,
            'status' => $this->status,
            'note' => $this->note,
            'user' => $this->whenLoaded('user'),
            'products' => $this->whenLoaded('products'),
            'details' => $this->whenLoaded('details', function () {
                return $this->details
                    ->map(function ($detail) {
                        return [
                            'id' => $detail->id,
                            'product_id' => $detail->product_id,
                            'combo_id' => $detail->combo_id,
                            'inventory_id' => $detail->inventory_id,
                            'quantity' => $detail->quantity,
                            'price_at_rental' =>
                                (float) $detail->price_at_rental,
                            'product' => $detail->product
                                ? [
                                    'id' => $detail->product->id,
                                    'name' => $detail->product->name,
                                    'deposit_price' =>
                                        (float) $detail->product->deposit_price,
                                ]
                                : null,
                            'combo' => $detail->combo
                                ? [
                                    'id' => $detail->combo->id,
                                    'name' => $detail->combo->name,
                                ]
                                : null,
                        ];
                    })
                    ->values();
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
