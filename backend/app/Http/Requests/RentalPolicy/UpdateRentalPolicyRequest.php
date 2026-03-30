<?php

namespace App\Http\Requests\RentalPolicy;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRentalPolicyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'late_day_fee' => ['sometimes', 'numeric', 'min:0'],
            'max_late_day' => ['sometimes', 'integer', 'min:1'],
        ];
    }
}
