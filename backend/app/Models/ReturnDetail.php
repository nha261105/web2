<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturnDetail extends Model
{
    use HasFactory;

    protected $table = 'return_details';
    public $timestamps = false;

    protected $fillable = [
        'return_order_id',
        'rental_detail_id',
        'condition',
        'note',
    ];

    public function returnOrder()
    {
        return $this->belongsTo(ReturnOrder::class, 'return_order_id');
    }

    public function rentalDetail()
    {
        return $this->belongsTo(RentalDetail::class, 'rental_detail_id');
    }
}
