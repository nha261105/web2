<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function rental(): BelongsTo
    {
        return $this->belongsTo(Rental::class, 'rental_id');
    }

    public function rentalDetail(): BelongsTo
    {
        return $this->belongsTo(RentalDetail::class, 'rental_detail_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'issue_id');
    }
}
