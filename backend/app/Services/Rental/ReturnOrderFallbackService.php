<?php

namespace App\Services\Rental;

use App\Models\Rental;
use App\Models\RentalIssue;
use App\Models\Inventory;
use App\Models\ReturnDetail;
use App\Models\ReturnOrder;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class ReturnOrderFallbackService
{
    /**
     * Process return and auto-calculate penalties.
     *
     * Expected item payload:
     * - rental_detail_id: int
     * - violation_type|condition: GOOD|DAMAGED|LOST
     * - note: optional text
     */
    public function processReturn(
        int $rentalId,
        array $items,
        string $returnDateInput,
    ): array {
        return DB::transaction(function () use (
            $rentalId,
            $items,
            $returnDateInput,
        ) {
            $rental = Rental::with([
                'details.product.policy',
                'details.combo.comboDetails.product.policy',
            ])->findOrFail($rentalId);

            if (
                ReturnOrder::query()->where('rental_id', $rental->id)->exists()
            ) {
                throw new InvalidArgumentException(
                    'Đơn thuê này đã hoàn tất trả hàng trước đó.',
                );
            }

            if (
                !in_array(
                    $rental->status,
                    ['PENDING', 'APPROVED', 'DEPOSITED', 'PICKED_UP'],
                    true,
                )
            ) {
                throw new InvalidArgumentException(
                    'Chỉ có thể complete trả hàng cho đơn đang thuê hoặc đã duyệt.',
                );
            }

            $returnDate = Carbon::parse($returnDateInput);
            $endDate = Carbon::parse($rental->end_date);

            $returnOrder = ReturnOrder::create([
                'rental_id' => $rental->id,
                'return_date' => $returnDate,
            ]);

            // Late days = return_date - rental end_date (theo ngày).
            $lateDays = max(
                0,
                $endDate
                    ->copy()
                    ->startOfDay()
                    ->diffInDays($returnDate->copy()->startOfDay(), false),
            );
            $forceLostByLate = $lateDays > 10;

            $itemMap = [];
            foreach ($items as $item) {
                $detailId = (int) Arr::get($item, 'rental_detail_id', 0);
                if ($detailId > 0) {
                    $itemMap[$detailId] = $item;
                }
            }

            $lateFeeTotal = 0.0;
            $conditionFeeTotal = 0.0;
            $createdIssueIds = [];

            foreach ($rental->details as $detail) {
                $item = $itemMap[$detail->id] ?? [];

                $condition = strtoupper(
                    (string) (Arr::get($item, 'violation_type') ??
                        (Arr::get($item, 'condition') ?? 'GOOD')),
                );

                if (!in_array($condition, ['GOOD', 'DAMAGED', 'LOST'], true)) {
                    $condition = 'GOOD';
                }

                if ($forceLostByLate) {
                    $condition = 'LOST';
                }

                $damagePercent =
                    (float) (Arr::get($item, 'damage_percent') ?? 0);
                $damagePercent = max(0.0, min(100.0, $damagePercent));

                $note = (string) (Arr::get($item, 'note') ?? '');

                ReturnDetail::create([
                    'return_order_id' => $returnOrder->id,
                    'rental_detail_id' => $detail->id,
                    'condition' => $condition,
                    'note' => $note !== '' ? $note : null,
                ]);

                $targetInventoryStatus = 'AVAILABLE';
                if ($condition === 'DAMAGED') {
                    $targetInventoryStatus = 'MAINTENANCE';
                } elseif ($condition === 'LOST') {
                    $targetInventoryStatus = 'LOST';
                }

                if ($detail->product_id) {
                    $this->updateInventoryStatus(
                        (int) $detail->product_id,
                        (int) $detail->quantity,
                        $targetInventoryStatus
                    );
                } elseif ($detail->combo) {
                    foreach ($detail->combo->comboDetails as $comboDetail) {
                        $comboProductId = (int) $comboDetail->product_id;
                        $reserveQty =
                            (int) $detail->quantity *
                            (int) $comboDetail->quantity;
                        $this->updateInventoryStatus(
                            $comboProductId,
                            $reserveQty,
                            $targetInventoryStatus
                        );
                    }
                }

                $lateFee = $this->calculateLateFee(
                    $detail,
                    $lateDays,
                    $forceLostByLate,
                );
                if ($lateFee > 0) {
                    $lateIssue = RentalIssue::create([
                        'rental_id' => $rental->id,
                        'rental_detail_id' => $detail->id,
                        'type' => 'LATE',
                        'description' => $this->buildLateDescription($lateDays),
                        'penalty_fee' => $lateFee,
                        'status' => 'PENDING',
                    ]);

                    Transaction::create([
                        'rental_id' => $rental->id,
                        'user_id' => $rental->user_id,
                        'issue_id' => $lateIssue->id,
                        'type' => 'FINE',
                        'amount' => $lateFee,
                        'payment_method' => 'SYSTEM',
                        'status' => 'PENDING',
                        'created_at' => $returnDate,
                    ]);

                    $lateFeeTotal += $lateFee;
                    $createdIssueIds[] = $lateIssue->id;
                }

                if (in_array($condition, ['DAMAGED', 'LOST'], true)) {
                    $conditionFee = $this->calculateConditionFee(
                        $detail,
                        $condition,
                        $returnDate,
                        $damagePercent,
                    );

                    $conditionIssue = RentalIssue::create([
                        'rental_id' => $rental->id,
                        'rental_detail_id' => $detail->id,
                        'type' => $condition,
                        'description' => $this->buildConditionDescription(
                            $detail,
                            $condition,
                            $returnDate,
                            $damagePercent,
                            $note,
                            $forceLostByLate,
                        ),
                        'penalty_fee' => $conditionFee,
                        'status' => 'PENDING',
                    ]);

                    if ($conditionFee > 0) {
                        Transaction::create([
                            'rental_id' => $rental->id,
                            'user_id' => $rental->user_id,
                            'issue_id' => $conditionIssue->id,
                            'type' => 'FINE',
                            'amount' => $conditionFee,
                            'payment_method' => 'SYSTEM',
                            'status' => 'PENDING',
                            'created_at' => $returnDate,
                        ]);
                    }

                    $conditionFeeTotal += $conditionFee;
                    $createdIssueIds[] = $conditionIssue->id;
                }
            }

            $rental->update([
                'status' => 'COMPLETED',
                'actual_return_date' => $returnDate,
            ]);

            return [
                'return_order' => $returnOrder->fresh(),
                'summary' => [
                    'late_days' => $lateDays,
                    'force_lost_by_late' => $forceLostByLate,
                    'late_fee_total' => $lateFeeTotal,
                    'condition_fee_total' => $conditionFeeTotal,
                    'total_fine' => $lateFeeTotal + $conditionFeeTotal,
                    'issue_ids' => $createdIssueIds,
                ],
            ];
        });
    }

    public function update(int $id, array $data): ReturnOrder
    {
        $returnOrder = ReturnOrder::query()->findOrFail($id);
        $returnOrder->fill($data)->save();

        return $returnOrder;
    }

    private function calculateLateFee(
        $detail,
        int $lateDays,
        bool $forceLostByLate,
    ): float {
        if ($lateDays <= 0 || $forceLostByLate) {
            return 0.0;
        }

        $rate = $this->getLateRate($lateDays);
        if ($rate <= 0) {
            return 0.0;
        }

        $lateFee = 0.0;

        if ($detail->product) {
            $dailyPrice = (float) ($detail->product->daily_price ?? 0);
            $lateFee += $dailyPrice * $rate * $lateDays * (int) $detail->quantity;
        } elseif ($detail->combo) {
            foreach ($detail->combo->comboDetails as $comboDetail) {
                $product = $comboDetail->product;
                if ($product) {
                    $dailyPrice = (float) ($product->daily_price ?? 0);
                    $qty = (int) $detail->quantity * (int) $comboDetail->quantity;
                    $lateFee += $dailyPrice * $rate * $lateDays * $qty;
                }
            }
        }

        return $lateFee;
    }

    private function calculateConditionFee(
        $detail,
        string $condition,
        Carbon $returnDate,
        float $damagePercent,
    ): float {
        $baseAmount = $this->calculateLossBaseAmount($detail, $returnDate);

        // Công thức ổn định hơn:
        // - DAMAGED: tính theo giá trị còn lại của thiết bị và hệ số hư hỏng cố định
        // - LOST: tính toàn bộ giá trị còn lại
        if ($condition === 'LOST') {
            return $baseAmount;
        }

        $effectivePercent = max(0.0, min(100.0, $damagePercent));
        return $baseAmount * ($effectivePercent / 100.0);
    }

    private function calculateLossBaseAmount($detail, Carbon $returnDate): float
    {
        $baseAmount = 0.0;

        if ($detail->product) {
            $baseAmount =
                $this->calculateCurrentAssetValue(
                    $detail->product->id,
                    (float) ($detail->product->deposit_price ?? 0),
                    $returnDate,
                ) * (int) $detail->quantity;
        } elseif ($detail->combo) {
            foreach ($detail->combo->comboDetails as $comboDetail) {
                $deposit = (float) ($comboDetail->product->deposit_price ?? 0);
                $qty = (int) $detail->quantity * (int) $comboDetail->quantity;
                $baseAmount +=
                    $this->calculateCurrentAssetValue(
                        $comboDetail->product->id,
                        $deposit,
                        $returnDate,
                    ) * $qty;
            }
        }

        return $baseAmount;
    }

    private function calculateCurrentAssetValue(
        int $productId,
        float $depositPrice,
        Carbon $returnDate,
    ): float {
        $purchasedAtValues = Inventory::query()
            ->where('product_id', $productId)
            ->whereNull('deleted_at')
            ->whereNotNull('purchased_at')
            ->pluck('purchased_at')
            ->map(fn($date) => Carbon::parse((string) $date)->getTimestamp())
            ->all();

        $referenceDate = Carbon::now();
        if (!empty($purchasedAtValues)) {
            $averageTimestamp = (int) round(
                array_sum($purchasedAtValues) / count($purchasedAtValues),
            );
            $referenceDate = Carbon::createFromTimestamp($averageTimestamp);
        }

        $ageMonths = max(0, $referenceDate->diffInMonths($returnDate));
        $factor = $this->getAgeFactor($ageMonths);

        return $depositPrice * $factor;
    }

    private function getAgeFactor(int $ageMonths): float
    {
        return match (true) {
            $ageMonths <= 6 => 1.0,
            $ageMonths <= 12 => 0.9,
            $ageMonths <= 24 => 0.75,
            $ageMonths <= 36 => 0.6,
            default => 0.5,
        };
    }

    private function buildConditionDescription(
        $detail,
        string $condition,
        Carbon $returnDate,
        float $damagePercent,
        string $note = '',
        bool $forceLostByLate = false,
    ): string {
        $baseValue = $this->calculateLossBaseAmount($detail, $returnDate);
        $ageText = $detail->product
            ? $this->describeAge($detail->product->id, $returnDate)
            : 'n/a';
        $description = sprintf(
            '%s | base_amount=%s | age=%s',
            $condition,
            number_format($baseValue, 0, ',', '.'),
            $ageText,
        );

        if ($condition === 'DAMAGED') {
            $description .= sprintf(
                ' | damage_percent=%s%%',
                rtrim(rtrim((string) $damagePercent, '0'), '.'),
            );
        }

        if ($forceLostByLate) {
            $description .= ' | quá_hạn_hơn_10_ngày_tự_động_tính_mất';
        }

        if ($note !== '') {
            $description .= ' | ' . $note;
        }

        return $description;
    }

    private function getLateRate(int $lateDays): float
    {
        return match (true) {
            $lateDays >= 1 && $lateDays <= 3 => 0.1,
            $lateDays >= 4 && $lateDays <= 5 => 0.15,
            $lateDays >= 6 && $lateDays <= 7 => 0.2,
            $lateDays >= 8 && $lateDays <= 10 => 0.3,
            default => 0.0,
        };
    }

    private function buildLateDescription(int $lateDays): string
    {
        $rate = $this->getLateRate($lateDays) * 100;
        return sprintf(
            'late_days=%d | late_rate_percent=%.0f%%',
            $lateDays,
            $rate,
        );
    }

    private function describeAge(int $productId, Carbon $returnDate): string
    {
        $purchasedAtValues = Inventory::query()
            ->where('product_id', $productId)
            ->whereNull('deleted_at')
            ->whereNotNull('purchased_at')
            ->pluck('purchased_at')
            ->map(fn($date) => Carbon::parse((string) $date)->getTimestamp())
            ->all();

        if (empty($purchasedAtValues)) {
            return 'unknown';
        }

        $averageTimestamp = (int) round(
            array_sum($purchasedAtValues) / count($purchasedAtValues),
        );
        $referenceDate = Carbon::createFromTimestamp($averageTimestamp);
        $ageMonths = max(0, $referenceDate->diffInMonths($returnDate));

        return $ageMonths . ' months';
    }

    private function updateInventoryStatus(int $productId, int $quantity, string $newStatus): void
    {
        $inventoryIds = DB::table('inventory')
            ->where('product_id', $productId)
            ->where('status', 'RENTING')
            ->whereNull('deleted_at')
            ->orderByDesc('id')
            ->limit($quantity)
            ->pluck('id')
            ->toArray();

        if (empty($inventoryIds)) {
            return;
        }

        DB::table('inventory')
            ->whereIn('id', $inventoryIds)
            ->update(['status' => $newStatus]);
    }
}
