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
            'receive_phone' => 'sometimes|string|max:20',
            'city' => 'sometimes|string',
            'district' => 'sometimes|string',
            'ward' => 'sometimes|string',
            'street' => 'sometimes|string',
            'note' => 'nullable|string',
            'is_default' => 'sometimes|boolean',
        ];
    }
}