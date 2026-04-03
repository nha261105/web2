<?php

namespace App\Services\User;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class UserService
{
    public function listUsers(int $perPage = 15): LengthAwarePaginator
    {
        return User::with('roles')
            ->withCount('rentals')
            ->withSum('rentals', 'total_price')
            ->paginate($perPage);
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
        return User::with(['roles', 'userInfo'])
            ->withCount('rentals')
            ->withSum('rentals', 'total_price')
            ->find($id);
    }

    private function emailExists(string $email, ?int $excludeId = null): bool
    {
        $query = User::where('email', $email);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        return $query->exists();
    }

    private function phoneExists(string $phone, ?int $excludeId = null): bool
    {
        $query = User::where('phone', $phone);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        return $query->exists();
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

    public function updateUser(int $userId, array $data): User
    {
        $user = User::findOrFail($userId);

        if (isset($data['email']) && $this->emailExists($data['email'], $userId)) {
            throw new \Exception('Email already exists');
        }

        if (isset($data['phone']) && $this->phoneExists($data['phone'], $userId)) {
            throw new \Exception('Phone number already exists');
        }

        if (isset($data['password'])) {
            $data['hash_password'] = $data['password'];
            unset($data['password']);
        }

        $user->update($data);
        return $user->fresh();
    }

    public function updateUserMe(int $userId, array $data): User
    {
        $user = User::findOrFail($userId);

        if (isset($data['avatar']) && str_contains($data['avatar'], 'base64,')) {
            $disk = \Storage::disk('public');
            
            if (!$disk->exists('avatars')) {
                $disk->makeDirectory('avatars', 0755, true);
            }

            $parts = explode(',', $data['avatar']);
            $imageData = base64_decode($parts[1]);
            $extension = str_contains($parts[0], 'png') ? 'png' : 'jpg';

            // 1. Xóa ảnh cũ trong bảng user_info
            if ($user->userInfo && $user->userInfo->user_img) {
                $oldPath = str_replace('storage/', '', $user->userInfo->user_img);
                $disk->delete($oldPath);
            }

            // 2. Lưu file
            $fileName = 'avatar_' . $userId . '_' . time() . '.' . $extension;
            $disk->put('avatars/' . $fileName, $imageData);
            $fullPath = 'storage/avatars/' . $fileName;

            $user->userInfo()->updateOrCreate(
                ['user_id' => $userId],
                ['user_img' => $fullPath]
            );
        }

        $user->update([
            'full_name' => $data['full_name'] ?? $user->full_name,
            'phone'     => $data['phone'] ?? $user->phone,
        ]);

        return $user->load('userInfo');
    }

    public function deleteUser(int $id): bool
    {
        return User::findOrFail($id)->delete();
    }
}