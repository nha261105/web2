<?php

namespace App\Services\Rental;

use App\Models\Rental;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class RentalService
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        return Rental::query()->paginate((int) ($filters['per_page'] ?? 15));
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
