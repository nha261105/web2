<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasFactory;
    use HasApiTokens;
    use SoftDeletes;

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

    // test false ->true
    public $timestamps = true;
    const UPDATED_AT = null;

    public function setHashPasswordAttribute($value): void
    {
        $this->attributes['hash_password'] = bcrypt($value);
    }

    public function tokens(): HasMany
    {
        return $this->hasMany(UserTokens::class, 'user_id');
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }

    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    public function hasPermission(string $permissionName): bool
    {
        return $this->roles()->whereHas('permissions', function ($query) use ($permissionName) {
            $query->where('name', $permissionName);
        })->exists();
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'ACTIVE');
    }

    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('status', 'INACTIVE');
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class, 'user_id');
    }

    /**
     * Get the password for the user.
     * Overrides the default getAuthPassword method to use 'hash_password' column.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->hash_password;
    }

}
