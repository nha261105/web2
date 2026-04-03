<?php

namespace App\Http\Resources\Rental;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RentalIssueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $description = (string) ($this->description ?? '');

        return [
            'id' => $this->id,
            'rental_id' => $this->rental_id,
            'rental_detail_id' => $this->rental_detail_id,
            'type' => $this->type,
            'description' => $description,
            'penalty_fee' => (float) $this->penalty_fee,
            'status' => $this->status,
            'meta' => [
                'late_days' => $this->extractInt(
                    '/(?:Trễ hạn\s+|late_days=)(\d+)(?:\s+ngày)?/u',
                    $description,
                ),
                'late_rate_percent' => $this->extractFloat(
                    '/(?:hệ số phí\s+|late_rate_percent=)([\d\.]+)%/u',
                    $description,
                ),
                'damage_percent' => $this->extractFloat(
                    '/(?:damage_percent=|hư_hỏng=)([\d\.]+)%/u',
                    $description,
                ),
                'base_amount' => $this->extractFloat(
                    '/(?:base_amount=|value=)([\d\.,]+)/u',
                    $description,
                ),
                'force_lost_by_late' => str_contains(
                    $description,
                    'quá_hạn_hơn_10_ngày_tự_động_tính_mất',
                ),
            ],
            'rental' => $this->whenLoaded('rental', function () {
                return [
                    'id' => $this->rental?->id,
                    'code' => $this->rental?->code,
                    'status' => $this->rental?->status,
                    'user' => $this->rental?->user
                        ? [
                            'id' => $this->rental->user->id,
                            'full_name' => $this->rental->user->full_name,
                            'email' => $this->rental->user->email,
                        ]
                        : null,
                ];
            }),
            'item' => $this->whenLoaded('rentalDetail', function () {
                return [
                    'id' => $this->rentalDetail?->id,
                    'quantity' => $this->rentalDetail?->quantity,
                    'product' => $this->rentalDetail?->product
                        ? [
                            'id' => $this->rentalDetail->product->id,
                            'name' => $this->rentalDetail->product->name,
                        ]
                        : null,
                ];
            }),
            'transactions' => $this->whenLoaded('transactions', function () {
                return $this->transactions
                    ->map(
                        fn($tx) => [
                            'id' => $tx->id,
                            'type' => $tx->type,
                            'amount' => (float) $tx->amount,
                            'payment_method' => $tx->payment_method,
                            'status' => $tx->status,
                            'created_at' => $tx->created_at,
                        ],
                    )
                    ->values();
            }),
        ];
    }

    private function extractInt(string $pattern, string $text): ?int
    {
        if (!preg_match($pattern, $text, $matches)) {
            return null;
        }

        return (int) $matches[1];
    }

    private function extractFloat(string $pattern, string $text): ?float
    {
        if (!preg_match($pattern, $text, $matches)) {
            return null;
        }

        return (float) $matches[1];
    }
}
