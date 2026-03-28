<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['name', 'slug'];
    public $timestamps = false;

    // một danh mục có thể có nhiều sản phẩm.
    // TODO: fix lại cái product sau.
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
