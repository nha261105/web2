<?php

namespace App\Http\Resources\Rental;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\AddressResource;
use App\Http\Resources\Rental\RentalDetailResource;

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
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'items' => RentalDetailResource::collection($this->whenLoaded('details')),
            'address' => new AddressResource($this->whenLoaded('address')),
        ];
    }
}
