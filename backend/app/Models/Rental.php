<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rental extends Model
{
    use HasFactory;
    protected $table = 'rentals';

    protected $fillable = [
        'user_id',
        'coupon_id',
        'address_id',
        'code',
        'start_date',
        'end_date',
        'actual_return_date',
        'total_price',
        'deposit_amount',
        'status',
        'note',
    ];

    public $timestamps = true;
}
