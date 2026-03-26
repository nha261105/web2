<?php

namespace App\Http\Middleware;

use App\Models\UserTokens;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $tokenString = $request->bearerToken();

        if (!$tokenString) {
            return response()->json([
                'success' => false,
                'message' => 'Chua cung cap token',
            ], 401);
        }

        $token = UserTokens::with('user.roles.permissions')
            ->where('token', $tokenString)
            ->first();

        if (!$token || !$token->user) {
            return response()->json([
                'success' => false,
                'message' => 'Token khong hop le',
            ], 401);
        }

        if (Carbon::now()->greaterThan($token->expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Token da het han, vui long dang nhap lai',
            ], 401);
        }

        $token->lastused_at = Carbon::now();
        $token->save();

        $request->attributes->set('auth_user', $token->user);
        $request->attributes->set('auth_token', $token);

        return $next($request);
    }
}
