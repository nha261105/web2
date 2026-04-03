<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $authUser = $this->attributes->get('auth_user');

        return [
            'full_name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($authUser->id),
            ],
            'phone' => [
                'sometimes',
                'regex:/^[0-9]{10}$/',
                Rule::unique('users', 'phone')->ignore($authUser->id),
            ],
            'password' => 'sometimes|string|min:8|max:255',
            'status' => 'sometimes|in:ACTIVE,INACTIVE',
            'avatar' => 'sometimes|nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'email.email' => 'Email không đúng định dạng',
            'email.unique' => 'Email đã bị người khác sử dụng',
            'phone.regex' => 'Số điện thoại phải có 10 chữ số',
            'phone.unique' => 'Số điện thoại đã bị người khác sử dụng',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự',
        ];
    }
}