<?php

namespace App\Models;

use App\Models\RentalDetail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'actual_return_date' => 'datetime',
    ];

    public $timestamps = true;

    public function details(): HasMany
    {
        return $this->hasMany(RentalDetail::class, 'rental_id');
    }
}
