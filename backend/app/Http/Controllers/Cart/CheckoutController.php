<?php

namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use App\Models\Rental;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

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
        $cart = Rental::with(['details.product', 'details.combo.comboDetails.product'])
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
                $stockAvailable = $detail->product->stock ?? 10;
                if ($detail->quantity > $stockAvailable) {
                    return ApiResponse::validation([
                        'stock' => [
                            "Sản phẩm \"{$detail->product->name}\" chỉ còn {$stockAvailable} trong kho, bạn đang đặt {$detail->quantity}."
                        ],
                    ]);
                }
            } elseif ($detail->combo) {
                foreach ($detail->combo->comboDetails as $comboDetail) {
                    $stockAvailable = $comboDetail->product->stock ?? 10;
                    $quantityNeeded = $detail->quantity * $comboDetail->quantity;
                    if ($quantityNeeded > $stockAvailable) {
                        return ApiResponse::validation([
                            'stock' => [
                                "Sản phẩm \"{$comboDetail->product->name}\" (trong combo {$detail->combo->name}) chỉ còn {$stockAvailable} trong kho, bạn cần {$quantityNeeded}."
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
            $totalPrice += $detail->price_at_rental * $detail->quantity * $rentalDays;
            
            if ($detail->product) {
                $depositAmount += ($detail->product->deposit_price ?? 0) * $detail->quantity;
            } elseif ($detail->combo) {
                foreach ($detail->combo->comboDetails as $comboDetail) {
                    $depositAmount += ($comboDetail->product->deposit_price ?? 0) * $detail->quantity * $comboDetail->quantity;
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
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Trừ stock ngay lập tức
        foreach ($cart->details as $detail) {
            if ($detail->product) {
                $detail->product->decrement('stock', $detail->quantity);
                $detail->product->refresh();
                if ($detail->product->stock < 1) {
                    $detail->product->update(['status' => 'INACTIVE']);
                }
            } elseif ($detail->combo) {
                foreach ($detail->combo->comboDetails as $comboDetail) {
                    $product = $comboDetail->product;
                    if ($product) {
                        $qty = $detail->quantity * $comboDetail->quantity;
                        $product->decrement('stock', $qty);
                        $product->refresh();
                        if ($product->stock < 1) {
                            $product->update(['status' => 'INACTIVE']);
                        }
                    }
                }
            }
        }

        return ApiResponse::success([
            'rental' => $cart,
        ], 'Checkout successful. Order is now PENDING.');
    }
}
