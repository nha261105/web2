<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function issue(): BelongsTo
    {
        return $this->belongsTo(RentalIssue::class, 'issue_id');
    }

    public function rental(): BelongsTo
    {
        return $this->belongsTo(Rental::class, 'rental_id');
    }
}
