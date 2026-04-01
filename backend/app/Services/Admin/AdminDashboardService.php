<?php

namespace App\Services\Admin;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AdminDashboardService
{
    public function getOverview(): array
    {
        return [
            'cards' => $this->getCards(),
            'revenue_overview' => $this->getRevenueOverview(),
            'rental_by_category' => $this->getRentalByCategory(),
            'recent_orders' => $this->getRecentOrders(),
        ];
    }

    private function getCards(): array
    {
        $totalRevenue = (float) DB::table('transactions')
            ->where('status', 'SUCCESS')
            ->where('type', 'PAYMENT')
            ->sum('amount');

        $totalOrders = (int) DB::table('rentals')->count();

        $activeProducts = (int) DB::table('products')
            ->where('status', 'ACTIVE')
            ->whereNull('deleted_at')
            ->count();

        $newUsers = (int) DB::table('users')
            ->whereNull('deleted_at')
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        return [
            'total_revenue' => $totalRevenue,
            'total_orders' => $totalOrders,
            'active_products' => $activeProducts,
            'new_users' => $newUsers,
        ];
    }

    private function getRevenueOverview(): array
    {
        $months = $this->lastMonths(6);

        $revenueRows = DB::table('transactions')
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month_key")
            ->selectRaw('COALESCE(SUM(amount), 0) as revenue')
            ->where('status', 'SUCCESS')
            ->where('type', 'PAYMENT')
            ->whereIn(DB::raw("DATE_FORMAT(created_at, '%Y-%m')"), $months)
            ->groupBy('month_key')
            ->pluck('revenue', 'month_key');

        $orderRows = DB::table('rentals')
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month_key")
            ->selectRaw('COUNT(*) as orders')
            ->whereIn(DB::raw("DATE_FORMAT(created_at, '%Y-%m')"), $months)
            ->groupBy('month_key')
            ->pluck('orders', 'month_key');

        return collect($months)
            ->map(function (string $monthKey) use ($revenueRows, $orderRows) {
                return [
                    'month' => $monthKey,
                    'revenue' => (float) ($revenueRows[$monthKey] ?? 0),
                    'orders' => (int) ($orderRows[$monthKey] ?? 0),
                ];
            })
            ->values()
            ->all();
    }

    private function getRentalByCategory(): array
    {
        return DB::table('rental_details')
            ->join('products', 'products.id', '=', 'rental_details.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->select('categories.name as category')
            ->selectRaw('COUNT(rental_details.id) as rentals')
            ->selectRaw(
                'COALESCE(SUM(rental_details.quantity * rental_details.price_at_rental), 0) as revenue',
            )
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('rentals')
            ->limit(5)
            ->get()
            ->map(function (object $row) {
                return [
                    'category' => $row->category,
                    'rentals' => (int) $row->rentals,
                    'revenue' => (float) $row->revenue,
                ];
            })
            ->all();
    }

    private function getRecentOrders(): array
    {
        return DB::table('rentals')
            ->leftJoin('users', 'users.id', '=', 'rentals.user_id')
            ->leftJoin(
                'rental_details',
                'rental_details.rental_id',
                '=',
                'rentals.id',
            )
            ->leftJoin('products', 'products.id', '=', 'rental_details.product_id')
            ->select(
                'rentals.id',
                'rentals.code',
                'users.full_name as customer_name',
                'rentals.total_price',
                'rentals.status',
                'rentals.created_at',
            )
            ->selectRaw('MIN(products.name) as first_product')
            ->selectRaw('COUNT(DISTINCT products.id) as product_count')
            ->groupBy(
                'rentals.id',
                'rentals.code',
                'users.full_name',
                'rentals.total_price',
                'rentals.status',
                'rentals.created_at',
            )
            ->orderByDesc('rentals.created_at')
            ->limit(5)
            ->get()
            ->map(function (object $row) {
                $productName = $row->first_product ?: 'N/A';
                $productCount = (int) $row->product_count;

                if ($productCount > 1 && $row->first_product) {
                    $productName = sprintf(
                        '%s +%d more',
                        $row->first_product,
                        $productCount - 1,
                    );
                }

                return [
                    'id' => $row->code ?: 'RENTAL-' . $row->id,
                    'customer' => $row->customer_name ?: 'Unknown',
                    'product' => $productName,
                    'amount' => (float) $row->total_price,
                    'status' => $row->status,
                    'date' => $row->created_at
                        ? Carbon::parse($row->created_at)->toDateString()
                        : null,
                ];
            })
            ->all();
    }

    private function lastMonths(int $size): array
    {
        $months = Collection::times($size, function (int $index) use ($size) {
            return now()->copy()->subMonths($size - $index)->format('Y-m');
        })->all();

        return array_values(array_unique($months));
    }
}
