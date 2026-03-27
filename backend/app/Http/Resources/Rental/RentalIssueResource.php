<?php

namespace App\Http\Resources\Rental;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RentalIssueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rental_id' => $this->rental_id,
            'rental_detail_id' => $this->rental_detail_id,
            'type' => $this->type,
            'description' => $this->description,
            'penalty_fee' => $this->penalty_fee,
            'status' => $this->status,
        ];
    }
}
