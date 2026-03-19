<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\UserTokens;
use App\Models\Users;
use Carbon\Carbon;
use Illuminate\Support\Str;

class UsersController extends Controller
{
    /**
     * Trả về thông tin user trong bảng users dựa trên email và password user
     * 
     * @param Request $email email của user
     * @param Request $password Mật khẩu user
     * @return JsonResponse 
     * */ 
    public function signInUserByEmailAndPassword(Request $request){
        try{
            $email = $request->input('email');
            $password = $request->input('password');

            $user = Users::where('email',  $email)->where('password', $password)->first();
            if($user){
                
                $tokenRecord = UserTokens::create([
                    'user_id' => $user->id,
                    'expires_at' => Carbon::now()->addMinutes(30)
                ]);

                $tokenRecord->token = hash('sha256', $tokenRecord->id . Str::random(20));
                $tokenRecord->save();

                return response()->json([
                    'success' => true,
                    'user' => $user,
                    'token' => $tokenRecord,
                ]);
            }
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc mật khẩu không đúng'
            ]);
        }
        catch(Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

}
