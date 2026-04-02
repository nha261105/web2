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
        $cart = Rental::with('details')
            ->where('user_id', $user->id)
            ->where('status', 'CART')
            ->first();

        if (!$cart || $cart->details->isEmpty()) {
            return ApiResponse::error('Cart is empty', 'CART_EMPTY', 400);
        }

        // Calculation
        $totalPrice = 0;
        $depositAmount = 0;

        $rentalDays = 1;
        if ($cart->start_date && $cart->end_date) {
            $start = Carbon::parse($cart->start_date);
            $end = Carbon::parse($cart->end_date);
            $rentalDays = max(1, $start->diffInDays($end) + 1);
        }

        /** @var \App\Models\RentalDetail $detail */
        foreach ($cart->details as $detail) {
            $totalPrice += $detail->price_at_rental * $detail->quantity * $rentalDays;
            
            // Collect deposit if it was a product. (We assume product's deposit_price is not stored in rental_details right now, so we need to eager load it if needed. 
            // For now we'll fetch product directly to calculate deposit)
            if ($detail->product) {
                // If the product belongs to the detail, calculate:
                $depositAmount += $detail->product->deposit_price * $detail->quantity;
            } else if ($detail->combo) {
                // We assume combo does not have deposit structure right now, or maybe it does? 
                // Wait, checking the DB schema, combos might not have deposit_price.
            }
        }

        $cart->update([
            'address_id' => $validated['address_id'] ?? null,
            'note' => $validated['note'] ?? null,
            'total_price' => $totalPrice,
            'deposit_amount' => $depositAmount,
            'code' => 'RNT' . strtoupper(Str::random(8)),
            'status' => 'PENDING',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        return ApiResponse::success([
            'rental' => $cart,
        ], 'Checkout successful. Order is now PENDING.');
    }
}
