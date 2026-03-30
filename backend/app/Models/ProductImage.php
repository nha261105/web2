<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    protected $table = 'product_img';

    public $timestamps = false;

    protected $fillable = ['product_id', 'image_url'];
}
