<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserTokens;
use App\Support\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Throwable;

class AuthController extends Controller
{
    private function verifyPassword(string $plainPassword, string $hashedPassword): array
    {
        try {
            return [Hash::check($plainPassword, $hashedPassword), false];
        } catch (\RuntimeException) {
            // Accept legacy hashes (e.g. $2a$...) then upgrade them after successful login.
            return [password_verify($plainPassword, $hashedPassword), true];
        }
    }

    /**
     * Đăng nhập bằng email và mật khẩu
     */
    public function signIn(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
            'isRemember' => 'nullable|boolean',
        ]);

        try {
            $email = $validated['email'];
            $password = $validated['password'];
            $isRemember = (bool) ($validated['isRemember'] ?? false);

            $user = User::with('roles.permissions')
                ->where('email', $email)
                ->first();

            if (!$user) {
                return ApiResponse::error(
                    'Email or password is incorrect',
                    'INVALID_CREDENTIALS',
                    401,
                );
            }

            [$isPasswordValid, $shouldUpgradeHash] = $this->verifyPassword($password, $user->hash_password);

            if (!$isPasswordValid) {
                return ApiResponse::error(
                    'Email or password is incorrect',
                    'INVALID_CREDENTIALS',
                    401,
                );
            }

            if ($shouldUpgradeHash) {
                $user->hash_password = $password;
                $user->save();
            }

            $tokenRecord = UserTokens::create([
                'user_id' => $user->id,
                'token' => hash('sha256', Str::random(40)),
                'expires_at' => $isRemember
                    ? Carbon::now()->addMinutes(30 * 24 * 60)
                    : Carbon::now()->addMinutes(30),
                'lastused_at' => Carbon::now(),
            ]);

            $permissions = $user->roles
                ->flatMap(fn($role) => $role->permissions->pluck('name'))
                ->unique()
                ->values();

            return ApiResponse::success(
                [
                    'user' => $user,
                    'roles' => $user->roles->pluck('name')->values(),
                    'permissions' => $permissions,
                    'token' => [
                        'access_token' => $tokenRecord->token,
                        'expires_at' => $tokenRecord->expires_at,
                    ],
                ],
                'Sign in successful',
            );
        } catch (Throwable $e) {
            report($e);

            return ApiResponse::internalError();
        }
    }

    public function me(Request $request)
    {
        $user = $request->attributes->get('auth_user');

        if (!$user) {
            return ApiResponse::unauthorized();
        }

        $user->load('roles.permissions');

        return ApiResponse::success([
            'user' => $user,
            'roles' => $user->roles->pluck('name')->values(),
            'permissions' => $user->roles
                ->flatMap(fn($role) => $role->permissions->pluck('name'))
                ->unique()
                ->values(),
        ]);
    }

    public function signOut(Request $request)
    {
        $token = $request->attributes->get('auth_token');

        if (!$token) {
            return ApiResponse::unauthorized();
        }

        $token->delete();

        return ApiResponse::success([], 'Sign out successful');
    }
}
