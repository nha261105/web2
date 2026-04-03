<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RentalDetail extends Model
{
    protected $table = 'rental_details';

    protected $fillable = [
        'rental_id',
        'product_id',
        'combo_id',
        'inventory_id',
        'quantity',
        'price_at_rental',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price_at_rental' => 'float',
    ];

    public function rental(): BelongsTo
    {
        return $this->belongsTo(Rental::class, 'rental_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function combo(): BelongsTo
    {
        return $this->belongsTo(Combo::class, 'combo_id');
    }

    public function returnDetails(): HasMany
    {
        return $this->hasMany(ReturnDetail::class, 'rental_detail_id');
    }
}
