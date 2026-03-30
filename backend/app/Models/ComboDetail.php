<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComboDetail extends Model
{
    protected $fillable = ['combo_id', 'product_id', 'quantity'];
    public $timestamps = false;

    public function combo(): BelongsTo
    {
        return $this->belongsTo(Combo::class, 'combo_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
