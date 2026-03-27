<?php

namespace App\Services\Rental;

use App\Models\ReturnOrder;

class ReturnOrderService
{
    public function create(array $data): ReturnOrder
    {
        return ReturnOrder::create($data);
    }

    public function update(int $id, array $data): ReturnOrder
    {
        $returnOrder = ReturnOrder::query()->findOrFail($id);
        $returnOrder->fill($data)->save();

        return $returnOrder;
    }
}
