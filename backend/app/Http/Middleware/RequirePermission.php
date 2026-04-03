<?php

namespace App\Http\Middleware;

use App\Support\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequirePermission
{
    public function handle(
        Request $request,
        Closure $next,
        string ...$permissions,
    ): Response {
        $user = $request->attributes->get('auth_user');

        if (!$user) {
            return ApiResponse::unauthorized();
        }

        // ADMIN is a super-role and can execute any permission-guarded action.
        if ($user->hasRole('ADMIN')) {
            return $next($request);
        }

        foreach ($permissions as $permission) {
            if ($user->hasPermission($permission)) {
                return $next($request);
            }
        }

        return ApiResponse::forbidden();
    }
}
