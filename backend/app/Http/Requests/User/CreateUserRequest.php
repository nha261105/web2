<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:8|max:255',
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users,phone|regex:/^[0-9]{10}$/',
            'status' => 'nullable|in:ACTIVE,INACTIVE',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email không được để trống',
            'email.email' => 'Email không đúng định dạng',
            'email.unique' => 'Email đã tồn tại',
            'password.required' => 'Mật khẩu không được để trống',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự',
            'full_name.required' => 'Họ tên không được để trống',
            'phone.required' => 'Số điện thoại không được để trống',
            'phone.regex' => 'Số điện thoại phải có 10 chữ số',
            'phone.unique' => 'Số điện thoại đã tồn tại',
            'status.in' => 'Trạng thái không hợp lệ',
        ];
    }
}
