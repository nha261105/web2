<?php

namespace App\Http\Requests\Rental;

use Illuminate\Foundation\Http\FormRequest;

class CreateReturnOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rental_id' => ['required', 'integer', 'exists:rentals,id'],
            'return_date' => ['required', 'date'],
        ];
    }
}
