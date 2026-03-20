<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\UserTokens;
use App\Models\Users;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

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
            $isRemember = $request->input('isRemember');

            $user = Users::where('email',  $email)->first();
            if($user){
                // Nểu mật khẩu không khớp
                if(!Hash::check($password, $user->hash_password)){
                    return response()->json([
                        'success' => false,
                        'message' => 'Email hoặc mật khẩu không đúng'
                    ]);
                }
                $tokenRecord = UserTokens::create([
                    'user_id' => $user->id,
                    'token' => hash('sha256', Str::random(40)),
                    'expires_at' => $isRemember ? Carbon::now()->addMinutes(30 * 24 * 60) : Carbon::now(),
                    'lastused_at' => Carbon::now(),
                ]);

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
