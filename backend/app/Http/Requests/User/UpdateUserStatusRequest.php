<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'status' => 'required|string|in:ACTIVE,INACTIVE',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Trạng thái là bắt buộc.',
            'status.in' => 'Trạng thái phải là ACTIVE hoặc INACTIVE.',
        ];
    }
}