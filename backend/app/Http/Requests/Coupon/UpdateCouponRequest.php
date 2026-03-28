<?php

namespace App\Http\Requests\Coupon;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCouponRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $couponId = $this->route('coupon');

        return [
            'code' => [
                'sometimes',
                'string',
                'max:100',
                Rule::unique('coupons', 'code')->ignore($couponId),
            ],
            'discount_amount' => ['sometimes', 'numeric', 'min:0'],
            'description' => ['sometimes', 'nullable', 'string'],
            'valid_from' => ['sometimes', 'nullable', 'date'],
            'valid_until' => [
                'sometimes',
                'nullable',
                'date',
                'after_or_equal:valid_from',
            ],
        ];
    }
}
