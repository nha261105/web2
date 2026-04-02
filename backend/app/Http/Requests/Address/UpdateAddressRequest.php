<?php

namespace App\Http\Requests\Address;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'receive_name' => 'sometimes|string|max:255',
            'receive_phone' => ['sometimes', 'regex:/^(0|\+84)[0-9]{9}$/'],
            'city' => 'sometimes|string',
            'ward' => 'sometimes|string',
            'street' => 'sometimes|string',
            'note' => 'nullable|string',
            'is_default' => 'sometimes|boolean',
        ];
    }
}