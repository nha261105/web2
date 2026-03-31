<?php

namespace App\Http\Requests\Combos;

use Illuminate\Foundation\Http\FormRequest;

class UpdateComboRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'daily_price' => ['sometimes', 'numeric', 'min:0'],
            'description' => ['sometimes', 'string'],
            'items' => ['sometimes', 'array', 'min:1'],
            'items.*.product_id' => [
                'required_with:items',
                'integer',
                'exists:products,id',
                'distinct',
            ],
            'items.*.quantity' => ['required_with:items', 'integer', 'min:1'],
        ];
    }
    public function messages(): array
    {
        return [
            'items.min' => 'Combo phải có ít nhất 1 sản phẩm.',
            'items.*.product_id.distinct' =>
                'Không được chọn cùng một sản phẩm nhiều lần.',
            'items.*.product_id.exists' => 'Sản phẩm này không tồn tại.',
            'items.*.quantity.min' => 'Số lượng sản phẩm phải lớn hơn 0.',
        ];
    }
}
