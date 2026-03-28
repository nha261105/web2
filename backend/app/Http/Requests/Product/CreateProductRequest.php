<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class CreateProductRequest extends FormRequest
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
            'policies_id' => [
                'required',
                'integer',
                'exists:rental_policies,id',
            ],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:products,slug'],
            'daily_price' => ['required', 'numeric', 'min:0'],
            'deposit_price' => ['required', 'numeric', 'min:0'],
            'description' => ['required', 'string'],
            'status' => ['required', Rule::in(['ACTIVE', 'INACTIVE'])],
        ];
    }
}
