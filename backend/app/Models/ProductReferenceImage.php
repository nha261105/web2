<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductReferenceImage extends Model
{
    protected $table = 'product_reference_images';
    protected $fillable = ['product_id', 'slug', 'source_url', 'public_url'];
}
