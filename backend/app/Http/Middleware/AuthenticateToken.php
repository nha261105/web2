<?php

namespace App\Http\Middleware;

use App\Models\UserTokens;
use App\Support\ApiResponse;
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
            return ApiResponse::unauthorized();
        }

        $token = UserTokens::with('user.roles.permissions')
            ->where('token', $tokenString)
            ->first();

        if (!$token || !$token->user) {
            return ApiResponse::unauthorized();
        }

        if (Carbon::now()->greaterThan($token->expires_at)) {
            return ApiResponse::unauthorized('Token expired, please sign in again');
        }

        if ($token->user->status !== 'ACTIVE') {
            return ApiResponse::forbidden('Your account has been locked. Please contact support.');
        }

        $token->lastused_at = Carbon::now();
        $token->save();

        $request->attributes->set('auth_user', $token->user);
        $request->attributes->set('auth_token', $token);

        return $next($request);
    }
}
