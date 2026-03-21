<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'users';

    protected $fillable = [
        'email',
        'hash_password',
        'full_name',
        'phone',
        'status',
    ];

    protected $hidden = [
        'hash_password',
    ];

    public $timestamps = false;

    public function setHashPasswordAttribute($value): void
    {
        $this->attributes['hash_password'] = bcrypt($value);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'ACTIVE');
    }

    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('status', 'INACTIVE');
    }
}
