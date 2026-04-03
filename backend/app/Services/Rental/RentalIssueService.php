<?php

namespace App\Services\Rental;

use App\Models\RentalIssue;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class RentalIssueService
{
    public function paginateForAdmin(array $filters = []): LengthAwarePaginator
    {
        return RentalIssue::query()
            ->with(['rental.user', 'rentalDetail.product', 'transactions'])
            ->when(
                $filters['type'] ?? null,
                fn($q, $type) => $q->where('type', $type),
            )
            ->when(
                $filters['status'] ?? null,
                fn($q, $status) => $q->where('status', $status),
            )
            ->when(
                $filters['rental_id'] ?? null,
                fn($q, $rentalId) => $q->where('rental_id', (int) $rentalId),
            )
            ->when(
                $filters['user_id'] ?? null,
                fn($q, $userId) => $q->whereHas(
                    'rental',
                    fn($rq) => $rq->where('user_id', (int) $userId),
                ),
            )
            ->orderByDesc('id')
            ->paginate((int) ($filters['per_page'] ?? 20));
    }

    public function paginateForUser(
        int $userId,
        array $filters = [],
    ): LengthAwarePaginator {
        return RentalIssue::query()
            ->with(['rental.user', 'rentalDetail.product', 'transactions'])
            ->whereHas('rental', fn($q) => $q->where('user_id', $userId))
            ->when(
                $filters['status'] ?? null,
                fn($q, $status) => $q->where('status', $status),
            )
            ->when(
                $filters['type'] ?? null,
                fn($q, $type) => $q->where('type', $type),
            )
            ->orderByDesc('id')
            ->paginate((int) ($filters['per_page'] ?? 20));
    }

    public function create(array $data): RentalIssue
    {
        return RentalIssue::create($data);
    }

    public function update(int $id, array $data): RentalIssue
    {
        $issue = RentalIssue::query()->findOrFail($id);
        $issue->fill($data)->save();

        return $issue;
    }
}
