<?php

namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use App\Models\Combo;
use App\Models\Product;
use App\Models\Rental;
use App\Models\RentalDetail;
use App\Support\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->attributes->get('auth_user');
        if (!$user) {
            return ApiResponse::unauthorized();
        }

        $rental = Rental::with([
            'details.product.images',
            'details.product.brand',
            'details.product.category',
            'details.combo',
        ])
            ->where('user_id', $user->id)
            ->where('status', 'CART')
            ->first();

        if (!$rental || $rental->details->isEmpty()) {
            return ApiResponse::success(
                [
                    'items' => [],
                ],
                'Cart loaded successfully',
            );
        }

        $rentalDays = 1;
        if ($rental->start_date && $rental->end_date) {
            $start = Carbon::parse($rental->start_date);
            $end = Carbon::parse($rental->end_date);
            $rentalDays = max(1, $start->diffInDays($end) + 1);
        }

        $payload = $rental->details->map(function ($detail) use (
            $rentalDays,
            $rental,
        ) {
            $product = $detail->product;
            $combo = $detail->combo;
            $image = null;

            if ($product && $product->images->isNotEmpty()) {
                $image = $product->images->first()->image_url;
            }

            $unitPrice = $detail->price_at_rental;
            $totalPrice = $unitPrice * $detail->quantity * $rentalDays;

            return [
                'id' => $detail->id,
                'type' => $product ? 'product' : 'combo',
                'quantity' => $detail->quantity,
                'rental_days' => $rentalDays,
                'unit_price' => (float) $unitPrice,
                'total_price' => (float) $totalPrice,
                'return_date' => $rental->end_date?->format('Y-m-d'),
                'product' => $product
                    ? [
                        'id' => $product->id,
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'daily_price' => (float) $product->daily_price,
                        'description' => $product->description,
                        'status' => $product->status,
                        'brand' => $product->brand?->name,
                        'category' => $product->category?->name,
                        'image' => $image,
                    ]
                    : null,
                'combo' => $combo
                    ? [
                        'id' => $combo->id,
                        'name' => $combo->name,
                        'daily_price' => (float) $combo->daily_price,
                        'description' => $combo->description,
                    ]
                    : null,
            ];
        });

        return ApiResponse::success(
            [
                'items' => $payload->toArray(),
            ],
            'Cart loaded successfully',
        );
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->attributes->get('auth_user');
        if (!$user) {
            return ApiResponse::unauthorized();
        }

        $payload = $request->validate([
            'product_id' => ['nullable', 'integer'],
            'combo_id' => ['nullable', 'integer'],
            'quantity' => ['integer', 'min:1'],
            'rental_days' => ['integer', 'min:1'],
        ]);

        if (empty($payload['product_id']) && empty($payload['combo_id'])) {
            return ApiResponse::validation([
                'product_id' => ['product_id or combo_id is required'],
            ]);
        }

        if (!empty($payload['product_id']) && !empty($payload['combo_id'])) {
            return ApiResponse::validation([
                'product_id' => [
                    'product_id and combo_id cannot be submitted together',
                ],
            ]);
        }

        $payload['quantity'] = $payload['quantity'] ?? 1;
        $payload['rental_days'] = $payload['rental_days'] ?? 1;

        try {
            $item = $this->createOrUpdateCartItem($user, $payload);
            if (!$item) {
                return ApiResponse::internalError('Unable to add item to cart');
            }
        } catch (\Exception $e) {
            return ApiResponse::validation([
                'quantity' => [$e->getMessage()],
            ]);
        }

        $cart = Rental::where('user_id', $user->id)
            ->where('status', 'CART')
            ->first();

        $rentalDays = $cart
            ? $this->calculateRentalDays($cart)
            : $payload['rental_days'];

        return ApiResponse::success(
            [
                'item' => $this->formatCartDetail($item, $rentalDays),
            ],
            'Item added to cart successfully',
        );
    }

    public function rentNow(Request $request): JsonResponse
    {
        $user = $request->attributes->get('auth_user');
        if (!$user) {
            return ApiResponse::unauthorized();
        }

        $payload = $request->validate([
            'product_id' => ['nullable', 'integer'],
            'combo_id' => ['nullable', 'integer'],
            'quantity' => ['integer', 'min:1'],
            'rental_days' => ['integer', 'min:1'],
        ]);

        if (empty($payload['product_id']) && empty($payload['combo_id'])) {
            return ApiResponse::validation([
                'product_id' => ['product_id or combo_id is required'],
            ]);
        }

        if (!empty($payload['product_id']) && !empty($payload['combo_id'])) {
            return ApiResponse::validation([
                'product_id' => [
                    'product_id and combo_id cannot be submitted together',
                ],
            ]);
        }

        $payload['quantity'] = $payload['quantity'] ?? 1;
        $payload['rental_days'] = $payload['rental_days'] ?? 1;

        try {
            $item = $this->createOrUpdateCartItem($user, $payload);
            if (!$item) {
                return ApiResponse::internalError('Unable to add item to cart');
            }
        } catch (\Exception $e) {
            return ApiResponse::validation([
                'quantity' => [$e->getMessage()],
            ]);
        }

        $cart = Rental::where('user_id', $user->id)
            ->where('status', 'CART')
            ->first();

        $rentalDays = $cart
            ? $this->calculateRentalDays($cart)
            : $payload['rental_days'];

        return ApiResponse::success(
            [
                'checkout_url' => '/checkout',
                'item' => $this->formatCartDetail($item, $rentalDays),
            ],
            'Item added to cart. Ready to checkout',
        );
    }

    // Hàm cập nhật sản phẩm
    public function updateItem(Request $request, int $itemId): JsonResponse
    {
        $user = $request->attributes->get('auth_user');
        if (!$user) {
            return ApiResponse::unauthorized();
        }

        $payload = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cart = Rental::where('user_id', $user->id)
            ->where('status', 'CART')
            ->first();
        if (!$cart) {
            return ApiResponse::notFound('Cart not found');
        }

        $detail = RentalDetail::where('id', $itemId)
            ->where('rental_id', $cart->id)
            ->first();
        if (!$detail) {
            return ApiResponse::notFound('Cart item not found');
        }

        // Check stock
        if ($detail->product_id) {
            $product = $detail->product;
            if ($product) {
                $stockAvailable = $this->getAvailableStock($product);
                if ($payload['quantity'] > $stockAvailable) {
                    return ApiResponse::validation([
                        'quantity' => [
                            "Số lượng vượt quá tồn kho hiện tại (Tồn: {$stockAvailable})",
                        ],
                    ]);
                }
            }
        }

        $detail->quantity = $payload['quantity'];
        $detail->save();

        $this->updateCartTotals($cart);

        return ApiResponse::success([], 'Cart item updated successfully');
    }

    public function updateReturnDate(Request $request): JsonResponse
    {
        // Log::info("DEBUG");
        $user = $request->attributes->get('auth_user');
        if (!$user) {
            return ApiResponse::unauthorized();
        }

        $payload = $request->validate([
            'return_date' => ['required', 'date'],
        ]);

        $cart = Rental::where('user_id', $user->id)
            ->where('status', 'CART')
            ->first();
        if (!$cart) {
            return ApiResponse::notFound('Cart not found');
        }

        $startDate = Carbon::now()->startOfDay();
        $returnDate = Carbon::parse($payload['return_date']);

        if ($returnDate->lt($startDate)) {
            return ApiResponse::validation([
                'return_date' => [
                    'Return date must be same or after start date',
                ],
            ]);
        }

        $cart->start_date = $cart->start_date ?? $startDate;
        $cart->end_date = $returnDate;
        $cart->save();

        $this->updateCartTotals($cart);

        return ApiResponse::success(
            [
                'return_date' => $cart->end_date->format('Y-m-d'),
                'rental_days' => $this->calculateRentalDays($cart),
            ],
            'Cart return date updated successfully',
        );
    }

    /**
     * Hàm xóa item khỏi giỏ hàng
     * */
    public function destroyItem(Request $request, int $itemId): JsonResponse
    {
        // Lấy thông tin user
        $user = $request->attributes->get('auth_user');
        if (!$user) {
            return ApiResponse::unauthorized();
        }

        // Lấy danh sách sản phẩm trong giỏ hàng
        $cart = Rental::where('user_id', $user->id)
            ->where('status', 'CART')
            ->first();
        if (!$cart) {
            return ApiResponse::notFound('Cart not found');
        }

        // Lấy thông tin sản phẩm trong giỏ hàng
        $detail = RentalDetail::where('id', $itemId)
            ->where('rental_id', $cart->id)
            ->first();
        if (!$detail) {
            return ApiResponse::notFound('Cart item not found');
        }

        // Xóa item đó và cập nhật lại tổng tiền
        $detail->delete();
        $this->updateCartTotals($cart);

        // Return response
        return ApiResponse::success([], 'Cart item removed successfully');
    }

    private function createOrUpdateCartItem(
        $user,
        array $payload,
    ): ?RentalDetail {
        $productId = $payload['product_id'] ?? null;
        $comboId = $payload['combo_id'] ?? null;
        $quantity = $payload['quantity'];
        $rentalDays = $payload['rental_days'];

        $product = null;
        $combo = null;

        $addressId = $this->resolveCartAddressId($user);

        $cart = Rental::firstOrCreate(
            [
                'user_id' => $user->id,
                'status' => 'CART',
            ],
            [
                'coupon_id' => null,
                'address_id' => $addressId,
                'code' => 'CART-' . $user->id . '-' . Str::random(8),
                'start_date' => null,
                'end_date' => null,
                'actual_return_date' => null,
                'total_price' => 0,
                'deposit_amount' => 0,
                'note' => null,
            ],
        );

        if ($productId) {
            $product = Product::find($productId);
            if (!$product) {
                return null;
            }

            // Check stock if adding more
            $query = RentalDetail::where('rental_id', $cart->id ?? 0)
                ->where('product_id', $productId)
                ->whereNull('combo_id');
            $detail = $query->first();

            $totalRequested = ($detail ? $detail->quantity : 0) + $quantity;
            $stockAvailable = $this->getAvailableStock($product);
            if ($totalRequested > $stockAvailable) {
                throw new \Exception(
                    "Vượt quá số lượng tồn kho (Tồn: {$stockAvailable})",
                );
            }
        }

        if ($comboId) {
            $combo = Combo::find($comboId);
            if (!$combo) {
                return null;
            }
        }

        if ($addressId && $cart->address_id !== $addressId) {
            $cart->address_id = $addressId;
            $cart->save();
        }

        if (!$cart->start_date || !$cart->end_date) {
            $cart->start_date = Carbon::now();
            $cart->end_date = Carbon::now()->addDays(max(1, $rentalDays - 1));
            $cart->save();
        } else {
            $currentDays = $this->calculateRentalDays($cart);
            if ($rentalDays > $currentDays) {
                $cart->end_date = Carbon::parse($cart->start_date)->addDays(
                    max(1, $rentalDays - 1),
                );
                $cart->save();
            }
        }

        $query = RentalDetail::where('rental_id', $cart->id);
        if ($productId) {
            $query->where('product_id', $productId)->whereNull('combo_id');
        } else {
            $query->where('combo_id', $comboId)->whereNull('product_id');
        }

        $detail = $query->first();
        $unitPrice = $product ? $product->daily_price : $combo->daily_price;

        if ($detail) {
            $detail->quantity += $quantity;
            $detail->price_at_rental = $unitPrice;
            $detail->save();
            $this->updateCartTotals($cart);
            return $detail;
        }

        $detail = RentalDetail::create([
            'rental_id' => $cart->id,
            'product_id' => $productId,
            'combo_id' => $comboId,
            'quantity' => $quantity,
            'price_at_rental' => $unitPrice,
        ]);

        $this->updateCartTotals($cart);
        return $detail;
    }

    private function updateCartTotals(Rental $cart): void
    {
        $rentalDays = $this->calculateRentalDays($cart);
        $total = $cart->details->reduce(function ($sum, $detail) use (
            $rentalDays,
        ) {
            return $sum +
                $detail->price_at_rental * $detail->quantity * $rentalDays;
        }, 0);

        $cart->total_price = $total;
        $cart->save();
    }

    private function calculateRentalDays(Rental $rental): int
    {
        if ($rental->start_date && $rental->end_date) {
            $start = Carbon::parse($rental->start_date);
            $end = Carbon::parse($rental->end_date);
            return max(1, $start->diffInDays($end) + 1);
        }

        return 1;
    }

    private function formatCartDetail(
        RentalDetail $detail,
        int $rentalDays,
    ): array {
        $product = $detail->product;
        $combo = $detail->combo;

        return [
            'id' => $detail->id,
            'type' => $product ? 'product' : 'combo',
            'quantity' => $detail->quantity,
            'rental_days' => $rentalDays,
            'return_date' => $detail->rental?->end_date?->format('Y-m-d'),
            'unit_price' => (float) $detail->price_at_rental,
            'total_price' =>
                (float) ($detail->price_at_rental *
                    $detail->quantity *
                    $rentalDays),
            'product' => $product
                ? [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'daily_price' => (float) $product->daily_price,
                    'description' => $product->description,
                    'status' => $product->status,
                    'brand' => $product->brand?->name,
                    'category' => $product->category?->name,
                ]
                : null,
            'combo' => $combo
                ? [
                    'id' => $combo->id,
                    'name' => $combo->name,
                    'daily_price' => (float) $combo->daily_price,
                    'description' => $combo->description,
                ]
                : null,
        ];
    }

    private function resolveCartAddressId($user): ?int
    {
        $defaultAddress = $user
            ->addresses()
            ->where('is_default', true)
            ->first();
        if ($defaultAddress) {
            return $defaultAddress->id;
        }

        return $user->addresses()->orderBy('id')->value('id');
    }

    private function getAvailableStock(Product $product): int
    {
        return (int) $product
            ->inventories()
            ->where('status', 'AVAILABLE')
            ->whereNull('deleted_at')
            ->count();
    }
}
