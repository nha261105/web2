<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentalPolicy extends Model
{
    use HasFactory;

    protected $table = 'rental_policies';

    public $timestamps = false;

    protected $fillable = ['late_day_fee', 'max_late_day'];
}
