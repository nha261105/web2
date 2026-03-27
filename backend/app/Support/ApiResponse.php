<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function success(array $data = [], string $message = 'Success', int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    public static function error(string $message, string $code, int $status, array $errors = []): JsonResponse
    {
        $payload = [
            'success' => false,
            'message' => $message,
            'code' => $code,
        ];

        if (!empty($errors)) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $status);
    }

    public static function unauthorized(string $message = 'Unauthorized'): JsonResponse
    {
        return self::error($message, 'UNAUTHORIZED', 401);
    }

    public static function forbidden(string $message = 'Forbidden'): JsonResponse
    {
        return self::error($message, 'FORBIDDEN', 403);
    }

    public static function validation(array $errors, string $message = 'Validation failed'): JsonResponse
    {
        return self::error($message, 'VALIDATION_ERROR', 422, $errors);
    }

    public static function internalError(string $message = 'Internal server error'): JsonResponse
    {
        return self::error($message, 'INTERNAL_ERROR', 500);
    }
}