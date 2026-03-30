<?php

namespace App\Http\Requests\Combos;

use Illuminate\Foundation\Http\FormRequest;

class CreateComboRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'daily_price' => ['required', 'numeric', 'min:0'],
            'description' => ['required', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => [
                'required',
                'integer',
                'exists:products,id',
                'distinct',
            ],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
