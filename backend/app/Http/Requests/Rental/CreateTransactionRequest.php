<?php

namespace App\Http\Requests\Rental;

use Illuminate\Foundation\Http\FormRequest;

class CreateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rental_id' => ['required', 'integer', 'exists:rentals,id'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'issue_id' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:rental_issues,id',
            ],
            'type' => ['required', 'in:DEPOSIT,PAYMENT,REFUND,FINE'],
            'amount' => ['required', 'numeric', 'min:0'],
            'payment_method' => ['required', 'string', 'max:100'],
            'status' => ['required', 'in:SUCCESS,FAILED,PENDING'],
            'transaction_ref' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
