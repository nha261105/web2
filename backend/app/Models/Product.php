<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
class Product extends Model
{
    use SoftDeletes;
    protected $table = 'products';
    protected $fillable = [
        'policies_id',
        'category_id',
        'brand_id',
        'name',
        'slug',
        'daily_price',
        'deposit_price',
        'description',
        'status',
    ];

    protected $casts = [
        'daily_price' => 'decimal:2',
        'deposit_price' => 'decimal:2',
    ];

    public $timestamps = true;
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }
    public function policy(): BelongsTo
    {
        return $this->belongsTo(RentalPolicy::class, 'policies_id');
    }
    public function comboDetail(): HasMany
    {
        return $this->hasMany(ComboDetail::class);
    }
}
