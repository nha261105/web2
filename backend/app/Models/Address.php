<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $table = 'addresses';

    protected $fillable = [
        'user_id',
        'receive_name',
        'receive_phone',
        'city',
        'district',
        'ward',
        'street',
        'note',
        'is_default'
    ];

    public $timestamps = false;
}
