<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'code',
        'discount_amount',
        'description',
        'valid_from',
        'valid_until',
    ];

    protected $casts = [
        'discount_amount' => 'decimal:2',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
    ];
}
