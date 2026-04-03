<?php

namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use App\Models\Rental;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function checkout(Request $request): JsonResponse
    {
        $user = $request->attributes->get('auth_user');
        if (!$user) {
            return ApiResponse::unauthorized();
        }

        $validated = $request->validate([
            'address_id' => ['nullable', 'integer', 'exists:addresses,id'],
            'note' => ['nullable', 'string'],
        ]);

        // Find user's CART
        $cart = Rental::with([
            'details.product',
            'details.combo.comboDetails.product',
        ])
            ->where('user_id', $user->id)
            ->where('status', 'CART')
            ->first();

        if (!$cart || $cart->details->isEmpty()) {
            return ApiResponse::error('Cart is empty', 'CART_EMPTY', 400);
        }

        // Bug fix 5: Set default dates nếu chưa có
        if (!$cart->start_date || !$cart->end_date) {
            $cart->start_date = Carbon::now()->startOfDay();
            $cart->end_date = Carbon::now()->startOfDay()->addDay();
            $cart->save();
        }

        // Bug fix 4: Kiểm tra stock trước khi checkout (bao gồm Combo)
        foreach ($cart->details as $detail) {
            if ($detail->product) {
                $stockAvailable = $this->getAvailableStock(
                    $detail->product->id,
                );
                if ($detail->quantity > $stockAvailable) {
                    return ApiResponse::validation([
                        'stock' => [
                            "Sản phẩm \"{$detail->product->name}\" chỉ còn {$stockAvailable} trong kho, bạn đang đặt {$detail->quantity}.",
                        ],
                    ]);
                }
            } elseif ($detail->combo) {
                foreach ($detail->combo->comboDetails as $comboDetail) {
                    $stockAvailable = $this->getAvailableStock(
                        $comboDetail->product->id,
                    );
                    $quantityNeeded =
                        $detail->quantity * $comboDetail->quantity;
                    if ($quantityNeeded > $stockAvailable) {
                        return ApiResponse::validation([
                            'stock' => [
                                "Sản phẩm \"{$comboDetail->product->name}\" (trong combo {$detail->combo->name}) chỉ còn {$stockAvailable} trong kho, bạn cần {$quantityNeeded}.",
                            ],
                        ]);
                    }
                }
            }
        }

        // Calculation
        $totalPrice = 0;
        $depositAmount = 0;

        $start = Carbon::parse($cart->start_date);
        $end = Carbon::parse($cart->end_date);
        $rentalDays = max(1, $start->diffInDays($end) + 1);

        /** @var \App\Models\RentalDetail $detail */
        foreach ($cart->details as $detail) {
            $totalPrice +=
                $detail->price_at_rental * $detail->quantity * $rentalDays;

            if ($detail->product) {
                $depositAmount +=
                    ($detail->product->deposit_price ?? 0) * $detail->quantity;
            } elseif ($detail->combo) {
                foreach ($detail->combo->comboDetails as $comboDetail) {
                    $depositAmount +=
                        ($comboDetail->product->deposit_price ?? 0) *
                        $detail->quantity *
                        $comboDetail->quantity;
                }
            }
        }

        DB::beginTransaction();

        try {
            // Reserve inventory ngay lập tức
            foreach ($cart->details as $detail) {
                if ($detail->product) {
                    $ok = $this->reserveInventory(
                        $detail->product_id,
                        $detail->quantity,
                    );
                    if (!$ok) {
                        DB::rollBack();
                        return ApiResponse::validation([
                            'stock' => [
                                "Sản phẩm \"{$detail->product->name}\" không đủ tồn kho khả dụng để giữ hàng.",
                            ],
                        ]);
                    }
                } elseif ($detail->combo) {
                    foreach ($detail->combo->comboDetails as $comboDetail) {
                        if ($comboDetail->product) {
                            $qty = $detail->quantity * $comboDetail->quantity;
                            $ok = $this->reserveInventory(
                                $comboDetail->product->id,
                                $qty,
                            );
                            if (!$ok) {
                                DB::rollBack();
                                return ApiResponse::validation([
                                    'stock' => [
                                        "Sản phẩm \"{$comboDetail->product->name}\" trong combo không đủ tồn kho khả dụng để giữ hàng.",
                                    ],
                                ]);
                            }
                        }
                    }
                }
            }

            $cart->update([
                'address_id' => $validated['address_id'] ?? $cart->address_id,
                'note' => $validated['note'] ?? null,
                'total_price' => $totalPrice,
                'deposit_amount' => $depositAmount,
                'code' => 'RNT' . strtoupper(Str::random(8)),
                'status' => 'PENDING',
                'updated_at' => Carbon::now(),
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred during checkout', 'CHECKOUT_ERROR', 500);
        }

        return ApiResponse::success(
            [
                'rental' => $cart->fresh(),
            ],
            'Checkout successful. Order is now PENDING.',
        );
    }

    private function getAvailableStock(int $productId): int
    {
        return (int) DB::table('inventory')
            ->where('product_id', $productId)
            ->where('status', 'AVAILABLE')
            ->whereNull('deleted_at')
            ->count();
    }

    private function reserveInventory(int $productId, int $quantity): bool
    {
        $inventoryIds = DB::table('inventory')
            ->where('product_id', $productId)
            ->where('status', 'AVAILABLE')
            ->whereNull('deleted_at')
            ->orderBy('id')
            ->limit($quantity)
            ->pluck('id')
            ->toArray();

        if (count($inventoryIds) < $quantity) {
            return false;
        }

        DB::table('inventory')
            ->whereIn('id', $inventoryIds)
            ->update(['status' => 'RENTING']);

        return true;
    }
}
