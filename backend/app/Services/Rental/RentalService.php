<?php

namespace App\Services\Rental;

use App\Models\Rental;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class RentalService
{
    public function paginate(array $filters, $user): LengthAwarePaginator
    {
        $query = Rental::query();

        if (!$user) {
            return $query->where('id', 0)->paginate($filters['per_page'] ?? 15);
        }

        if (!$user->hasRole('ADMIN')) {
            $query->where('user_id', (int) $user->id);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }

    public function create(array $data): Rental
    {
        return Rental::create($data);
    }

    public function findById(int $id): Rental
    {
        return Rental::query()->findOrFail($id);
    }

    public function update(int $id, array $data): Rental
    {
        $rental = $this->findById($id);
        $rental->fill($data)->save();

        return $rental;
    }
}
