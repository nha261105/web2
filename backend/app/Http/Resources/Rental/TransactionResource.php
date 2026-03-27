<?php

namespace App\Http\Resources\Rental;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rental_id' => $this->rental_id,
            'user_id' => $this->user_id,
            'issue_id' => $this->issue_id,
            'type' => $this->type,
            'amount' => $this->amount,
            'payment_method' => $this->payment_method,
            'status' => $this->status,
            'transaction_ref' => $this->transaction_ref,
            'created_at' => $this->created_at,
        ];
    }
}
