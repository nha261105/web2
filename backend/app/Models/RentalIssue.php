<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RentalIssue extends Model
{
    protected $table = 'rental_issues';

    protected $fillable = [
        'rental_id',
        'rental_detail_id',
        'type',
        'description',
        'penalty_fee',
        'status',
    ];

    public $timestamps = false;
}
