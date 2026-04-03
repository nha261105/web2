<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReturnOrder extends Model
{
    protected $table = 'return_orders';

    protected $fillable = ['rental_id', 'return_date'];

    public $timestamps = false;

    public function rental(): BelongsTo
    {
        return $this->belongsTo(Rental::class, 'rental_id');
    }

    public function details(): HasMany
    {
        return $this->hasMany(ReturnDetail::class, 'return_order_id');
    }
}
