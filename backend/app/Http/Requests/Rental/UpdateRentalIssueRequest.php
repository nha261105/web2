<?php

namespace App\Http\Requests\Rental;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRentalIssueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'description' => ['sometimes', 'string'],
            'penalty_fee' => ['sometimes', 'numeric', 'min:0'],
            'status' => ['sometimes', 'in:PENDING,RESOLVED'],
        ];
    }
}
