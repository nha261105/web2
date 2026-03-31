<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'discount_amount' => $this->discount_amount,
            'description' => $this->description,
            'valid_from' => $this->valid_from?->format('Y-m-d H:i:s'),
            'valid_until' => $this->valid_until?->format('Y-m-d H:i:s'),
        ];
    }
}
