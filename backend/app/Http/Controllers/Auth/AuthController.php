<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserTokens;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Đăng nhập bằng email và mật khẩu
     */
    public function signIn(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string|min:8',
                'isRemember' => 'nullable|boolean',
            ]);

            $email = $validated['email'];
            $password = $validated['password'];
            $isRemember = (bool) ($validated['isRemember'] ?? false);

            $user = User::with('roles.permissions')->where('email', $email)->first();

            if (!$user || !Hash::check($password, $user->hash_password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email hoặc mật khẩu không đúng',
                ], 401);
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
                ->flatMap(fn ($role) => $role->permissions->pluck('name'))
                ->unique()
                ->values();

            return response()->json([
                'success' => true,
                'message' => 'Dang nhap thanh cong',
                'data' => [
                    'user' => $user,
                    'roles' => $user->roles->pluck('name')->values(),
                    'permissions' => $permissions,
                    'token' => [
                        'access_token' => $tokenRecord->token,
                        'expires_at' => $tokenRecord->expires_at,
                    ],
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function me(Request $request)
    {
        $user = $request->attributes->get('auth_user');

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Chua xac thuc',
            ], 401);
        }

        $user->load('roles.permissions');

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'roles' => $user->roles->pluck('name')->values(),
                'permissions' => $user->roles
                    ->flatMap(fn ($role) => $role->permissions->pluck('name'))
                    ->unique()
                    ->values(),
            ],
        ]);
    }

    public function signOut(Request $request)
    {
        $token = $request->attributes->get('auth_token');

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Khong tim thay token dang dang nhap',
            ], 401);
        }

        $token->delete();

        return response()->json([
            'success' => true,
            'message' => 'Dang xuat thanh cong',
        ]);
    }
}
