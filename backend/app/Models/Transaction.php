<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'transactions';

    protected $fillable = [
        'rental_id',
        'user_id',
        'issue_id',
        'type',
        'amount',
        'payment_method',
        'status',
        'transaction_ref',
        'created_at',
    ];

    public $timestamps = false;
}
