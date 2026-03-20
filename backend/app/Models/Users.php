<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Users extends Model
{
    use HasApiTokens;

    protected $table = 'users';
    protected $fillable = ['email', 'hash_password', 'full_name', 'phone', 'status'];
    public $timestamps = false;
}
