<?php

namespace App\Services\Rental;

use App\Models\Rental;
use App\Models\ReturnOrder;
use App\Models\ReturnDetail;
use App\Models\RentalIssue;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReturnOrderFallbackService
{
    /**
     * Handle the return logic for a rental.
     * 
     * @param int $rentalId
     * @param array $items Array of ['rental_detail_id' => x, 'condition' => 'GOOD'/'DAMAGED'/'LOST', 'note' => '...', 'penalty_fee' => 0]
     * @return ReturnOrder
     */
    public function processReturn(int $rentalId, array $items): ReturnOrder
    {
        return DB::transaction(function () use ($rentalId, $items) {
            $rental = Rental::with('details.product.policy')->findOrFail($rentalId);
            
            $now = Carbon::now();
            $endDate = Carbon::parse($rental->end_date);
            
            // Generate Return Order
            $returnOrder = ReturnOrder::create([
                'rental_id' => $rental->id,
                'return_date' => $now,
            ]);

            // Calculate overall late days
            $lateDays = 0;
            if ($now->greaterThan($endDate->copy()->endOfDay())) {
                $lateDays = $endDate->diffInDays($now);
            }

            foreach ($items as $item) {
                // Determine detail
                $detail = $rental->details()->where('id', $item['rental_detail_id'])->first();
                if (!$detail) continue;

                // Create Return Detail
                ReturnDetail::create([
                    'return_order_id' => $returnOrder->id,
                    'rental_detail_id' => $detail->id,
                    'condition' => $item['condition'],
                    'note' => $item['note'] ?? null,
                ]);

                // Restore stock if not LOST
                if ($item['condition'] !== 'LOST' && $detail->product) {
                    $detail->product->increment('stock', $detail->quantity);
                    if ($detail->product->stock > 0 && $detail->product->status === 'INACTIVE') {
                        $detail->product->update(['status' => 'ACTIVE']);
                    }
                }

                $totalPenaltyForDetail = 0;
                $issueDescription = [];

                // Late fee
                if ($lateDays > 0) {
                    $lateFee = 0;
                    if ($detail->product && $detail->product->policy) {
                        $lateFee = $detail->product->policy->late_day_fee * $lateDays * $detail->quantity;
                        $totalPenaltyForDetail += $lateFee;
                        $issueDescription[] = "Late {$lateDays} days";
                    }
                    
                    if ($lateFee > 0) {
                        $issue = RentalIssue::create([
                            'rental_id' => $rental->id,
                            'rental_detail_id' => $detail->id,
                            'type' => 'LATE',
                            'description' => "Late {$lateDays} days for " . ($detail->product->name ?? 'item'),
                            'penalty_fee' => $lateFee,
                            'status' => 'PENDING',
                        ]);

                        Transaction::create([
                            'rental_id' => $rental->id,
                            'user_id' => $rental->user_id,
                            'issue_id' => $issue->id,
                            'type' => 'FINE',
                            'amount' => $lateFee,
                            'payment_method' => 'SYSTEM',
                            'status' => 'PENDING',
                            'created_at' => Carbon::now(),
                        ]);
                    }
                }

                // Condition check
                if (in_array($item['condition'], ['DAMAGED', 'LOST'])) {
                    $conditionFee = $item['penalty_fee'] ?? 0;

                    $issue = RentalIssue::create([
                        'rental_id' => $rental->id,
                        'rental_detail_id' => $detail->id,
                        'type' => $item['condition'],
                        'description' => "Condition: " . $item['condition'] . ". Note: " . ($item['note'] ?? ''),
                        'penalty_fee' => $conditionFee,
                        'status' => 'PENDING',
                    ]);

                    if ($conditionFee > 0) {
                        Transaction::create([
                            'rental_id' => $rental->id,
                            'user_id' => $rental->user_id,
                            'issue_id' => $issue->id,
                            'type' => 'FINE',
                            'amount' => $conditionFee,
                            'payment_method' => 'SYSTEM',
                            'status' => 'PENDING',
                            'created_at' => Carbon::now(),
                        ]);
                    }
                }
            }

            // Verify if all details are returned
            $returnedDetailIds = ReturnDetail::whereIn('return_order_id', 
                ReturnOrder::where('rental_id', $rentalId)->pluck('id')
            )->pluck('rental_detail_id')->toArray();

            $allDetailIds = $rental->details->pluck('id')->toArray();

            // If all items returned, update rental status
            if (count(array_intersect($allDetailIds, $returnedDetailIds)) === count($allDetailIds)) {
                $rental->update([
                    'status' => 'COMPLETED',
                    'actual_return_date' => $now,
                ]);
            }

            return $returnOrder;
        });
    }

    public function update(int $id, array $data): ReturnOrder
    {
        $returnOrder = ReturnOrder::query()->findOrFail($id);
        $returnOrder->fill($data)->save();

        return $returnOrder;
    }
}
