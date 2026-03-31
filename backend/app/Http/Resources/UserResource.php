<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'full_name' => $this->full_name,
            'phone' => $this->phone,
            'status' => $this->status,
            'roles' => $this->whenLoaded('roles', function () {
                return $this->roles->map(fn($role) => [
                    'id' => $role->id,
                    'name' => $role->name
                ]);
            }),
            'kyc_status' => $this->whenLoaded('userInfo', function () {
                return $this->userInfo->status ?? 'PENDING';
            }),
            'id_card_number' => $this->whenLoaded('userInfo', function () {
                return $this->userInfo->id_card_number ?? null;
            }),
            'verified_at' => $this->whenLoaded('userInfo', function () {
                return $this->userInfo->verified_at?->toISOString();
            }),
            'addresses' => AddressResource::collection($this->whenLoaded('addresses')),
            'rentals_count' => $this->rentals_count ?? 0,
            'total_spent' => $this->rentals_sum_total_price ?? 0,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}