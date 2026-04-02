<?php

namespace App\Http\Requests\Address;

use Illuminate\Foundation\Http\FormRequest;

class CreateAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'receive_name' => 'required|string|max:255',
            'receive_phone' => [
                'required',
                'regex:/^(0|\+84)[0-9]{9}$/'
            ],
            'city' => 'required|string|max:100',
            'ward' => 'required|string|max:100',
            'street' => 'required|string|max:255',
            'note' => 'nullable|string|max:500',
            'is_default' => 'sometimes|boolean',
        ];
    }
    
    protected function prepareForValidation()
    {
        $this->merge([
            'receive_name' => trim($this->receive_name),
            'receive_phone' => trim($this->receive_phone),
            'street' => trim($this->street),
        ]);
    }
}
