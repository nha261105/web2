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
            $email = $request->input('email');
            $password = $request->input('password');
            $isRemember = (bool) $request->input('isRemember');

            $user = User::where('email', $email)->first();

            if (!$user || !Hash::check($password, $user->hash_password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email hoặc mật khẩu không đúng',
                ]);
            }

            $tokenRecord = UserTokens::create([
                'user_id' => $user->id,
                'token' => hash('sha256', Str::random(40)),
                'expires_at' => $isRemember
                    ? Carbon::now()->addMinutes(30 * 24 * 60)
                    : Carbon::now(),
                'lastused_at' => Carbon::now(),
            ]);

            return response()->json([
                'success' => true,
                'user' => $user,
                'token' => $tokenRecord,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }
}
