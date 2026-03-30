<?php

namespace App\Http\Requests\RentalPolicy;

use Illuminate\Foundation\Http\FormRequest;

class CreateRentalPolicyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'late_day_fee' => ['required', 'numeric', 'min:0'],
            'max_late_day' => ['required', 'integer', 'min:1'],
        ];
    }
}
