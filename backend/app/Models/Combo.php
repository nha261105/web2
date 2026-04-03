<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Combo extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'daily_price', 'description'];

    public $timestamps = false;

    public function comboDetails(): HasMany
    {
        return $this->hasMany(ComboDetail::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            'combo_details',
            'combo_id',
            'product_id',
        )->withPivot('quantity');
    }
}
