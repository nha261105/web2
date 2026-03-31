<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Address extends Model
{
    use HasFactory;
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

    public $timestamps = true;
}
