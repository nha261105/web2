<?php

namespace App\Services\User;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserService
{
    public function getAllUsers(int $perPage = 15)
    {
        return User::paginate($perPage);
    }

    public function getActiveUsers(): Collection
    {
        return User::active()->get();
    }

    public function getUserByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function getUserById(int $id): ?User
    {
        return User::find($id);
    }

    private function emailExists(string $email): bool
    {
        return User::where('email', $email)->exists();
    }

    private function phoneExists(string $phone): bool
    {
        return User::where('phone', $phone)->exists();
    }

    public function createUser(array $data): User
    {
        if ($this->emailExists($data['email'])) {
            throw new \Exception('Email đã tồn tại');
        }

        if ($this->phoneExists($data['phone'])) {
            throw new \Exception('Số điện thoại đã tồn tại');
        }

        return User::create([
            'email' => $data['email'],
            'hash_password' => $data['password'],
            'full_name' => $data['full_name'],
            'phone' => $data['phone'],
            'status' => $data['status'] ?? 'ACTIVE',
        ]);
    }
}

?>
