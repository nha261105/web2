<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use App\Models\User;

class UserTokens extends Model
{
    protected $table = 'user_tokens';
    protected $fillable = ['user_id', 'token', 'expires_at', 'lastused_at'];
    public $timestamps = false;

    /**
     * Kiểm tra liệu token có còn hạn không
     *
     * @return bool true nếu còn hạn, false ngược lại
     */
    public function isValid(): bool
    {
        return Carbon::now()->lessThanOrEqualTo($this->expires_at);
    }

    /**
     * Gia hạn thêm cho token 30 phút
     *
     * @return bool true nếu còn hạn, false ngược lại
     */
    public function refresh(int $minutes = 30)
    {
        $this->expires_at = Carbon::now()->addMinutes($minutes);
        $this->save();
    }

    /**
     * Liên kết với Users
     *
     * */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
