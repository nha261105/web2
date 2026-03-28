<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Combo extends Model
{
    protected $fillable = ['name', 'daily_price', 'description'];

    public $timestamps = false;

    public function comboDetails(): HasMany
    {
        return $this->hasMany(ComboDetail::class);
    }
}
