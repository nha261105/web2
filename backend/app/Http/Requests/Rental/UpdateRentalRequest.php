<?php

namespace App\Http\Requests\Rental;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRentalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after_or_equal:start_date'],
            'actual_return_date' => ['sometimes', 'nullable', 'date'],
            'total_price' => ['sometimes', 'numeric', 'min:0'],
            'deposit_amount' => ['sometimes', 'numeric', 'min:0'],
            'status' => [
                'sometimes',
                'in:PENDING,APPROVED,DEPOSITED,PICKED_UP,COMPLETED,CANCELLED',
            ],
            'note' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
