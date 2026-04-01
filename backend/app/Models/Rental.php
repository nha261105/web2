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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'rental_details', 'rental_id', 'product_id');
    }

    public function combos()
    {
        return $this->belongsToMany(Combo::class, 'rental_details', 'rental_id', 'combo_id');
    }
}
