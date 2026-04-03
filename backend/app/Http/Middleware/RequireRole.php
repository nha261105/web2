<?php

namespace App\Http\Middleware;

use App\Support\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireRole
{
    public function handle(
        Request $request,
        Closure $next,
        string ...$roles,
    ): Response {
        $user = $request->attributes->get('auth_user');

        if (!$user) {
            return ApiResponse::unauthorized();
        }

        // ADMIN can access routes protected by other role gates.
        if ($user->hasRole('ADMIN')) {
            return $next($request);
        }

        foreach ($roles as $role) {
            if ($user->hasRole($role)) {
                return $next($request);
            }
        }

        return ApiResponse::forbidden();
    }
}
