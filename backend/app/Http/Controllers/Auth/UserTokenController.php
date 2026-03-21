<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\UserTokens;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;

class UserTokenController extends Controller
{
    /**
     * Kiểm tra token còn hạn hay đã hết hạn
     */
    public function check(Request $request)
    {
        try {
            $tokenString = $request->bearerToken();

            if (!$tokenString) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token không tồn tại',
                ]);
            }

            $token = UserTokens::where('token', $tokenString)->first();

            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token không hợp lệ',
                ]);
            }

            if (Carbon::now()->greaterThan($token->expires_at) && Carbon::now()->subMinutes(30)->greaterThan($token->lastused_at)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token đã hết hạn. Vui lòng đăng nhập lại',
                ]);
            }

            $token->lastused_at = Carbon::now();
            $token->save();

            return response()->json([
                'success' => true,
                'message' => 'Token còn hạn',
                'token' => $token,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }
}
