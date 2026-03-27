<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReturnOrder extends Model
{
    protected $table = 'return_orders';

    protected $fillable = [
        'rental_id',
        'return_date',
    ];

    public $timestamps = false;
}
