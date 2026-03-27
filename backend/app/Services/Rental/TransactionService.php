<?php

namespace App\Services\Rental;

use App\Models\Transaction;

class TransactionService
{
    public function create(array $data): Transaction
    {
        return Transaction::create($data);
    }

    public function update(int $id, array $data): Transaction
    {
        $transaction = Transaction::query()->findOrFail($id);
        $transaction->fill($data)->save();

        return $transaction;
    }
}
