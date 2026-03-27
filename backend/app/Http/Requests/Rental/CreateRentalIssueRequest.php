<?php

namespace App\Http\Requests\Rental;

use Illuminate\Foundation\Http\FormRequest;

class CreateRentalIssueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rental_id' => ['required', 'integer', 'exists:rentals,id'],
            'rental_detail_id' => ['required', 'integer', 'exists:rental_details,id'],
            'type' => ['required', 'in:LATE,DAMAGED,LOST'],
            'description' => ['required', 'string'],
            'penalty_fee' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'in:PENDING,RESOLVED'],
        ];
    }
}
