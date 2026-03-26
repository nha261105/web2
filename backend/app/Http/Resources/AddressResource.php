<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
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
            'receive_name' => $this->receive_name,
            'receive_phone' => $this->receive_phone,
            'city' => $this->city,
            'district' => $this->district,
            'ward' => $this->ward,
            'street' => $this->street,
            'note' => $this->note,
            'is_default' => (bool) $this->is_default,
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
