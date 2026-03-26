<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserTokenController extends Controller
{
    /**
     * Kiểm tra token còn hạn hay đã hết hạn
     */
    public function check(Request $request)
    {
        $user = $request->attributes->get('auth_user');
        $token = $request->attributes->get('auth_token');

        if (!$user || !$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token khong hop le',
            ], 401);
        }

        $user->load('roles.permissions');

        return response()->json([
            'success' => true,
            'message' => 'Token con han',
            'data' => [
                'token' => [
                    'access_token' => $token->token,
                    'expires_at' => $token->expires_at,
                    'lastused_at' => $token->lastused_at,
                ],
                'user' => $user,
                'roles' => $user->roles->pluck('name')->values(),
                'permissions' => $user->roles
                    ->flatMap(fn ($role) => $role->permissions->pluck('name'))
                    ->unique()
                    ->values(),
            ],
        ]);
    }
}
