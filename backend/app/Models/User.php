<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    use HasFactory,Notifiable, HasApiTokens;

    protected $table = 'users';

    protected $fillable = [
        'email',
        'password',
        'full_name',
        'phone',
        'status',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function rentals() {
        return $this->hasMany(Rental::class);
    }

    public function scopeActive($query) {
        return $query->where('status','ACTIVE');
    }

    public function scopeInactive($query) {
        return $query->where('status','INACTIVE');
    }

    public function getFullNameAttribute($value) {
        return ucwords($value);
    }

    public function setPasswordAttribute($value) {
        $this->attributes['password'] = bcrypt($value);
    }
}



?>