<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->attributes->get('auth_user');

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Chua xac thuc',
            ], 401);
        }

        foreach ($roles as $role) {
            if ($user->hasRole($role)) {
                return $next($request);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Ban khong co role phu hop de truy cap tai nguyen nay',
        ], 403);
    }
}
