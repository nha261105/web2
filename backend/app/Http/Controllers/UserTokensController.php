<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserTokens;
use Carbon\Carbon;

class UserTokensController extends Controller
{
    /**
     * Test token còn hạn hay hết hạn, nếu còn hạn thì gia hạn thêm 30 phút, còn không bắt đăng nhập lại
     * 
     * @param Request $token token cần kiểm tra
     * @return JsonResponse 
     */
    public function checkUserToken(Request $request)
    {
        try{
            // Lấy param
            $tokenString = $request->bearerToken();
            if (!$tokenString) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token không tồn tại'
                ]);
            }
            
            // Tìm token
            $token = UserTokens::where('token', $tokenString)->first();  
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token không hợp lệ'
                ]);
            }

            // Nếu token hết hạn
            if (Carbon::now()->greaterThan($token->expires_at)) {
                $token->delete(); // xóa token hết hạn
                return response()->json([
                    'success' => false,
                    'message' => 'Token đã hết hạn. Vui lòng đăng nhập lại'
                ]);
            }

            // Nếu token còn hạn
            $token->expires_at = Carbon::now()->addMinutes(30);
            $token->save();
            return response()->json([
                'success' => true,
                'message' => 'Token còn hạn',
                'user_id' => $token->user_id,
            ]);
        }catch(Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
}
