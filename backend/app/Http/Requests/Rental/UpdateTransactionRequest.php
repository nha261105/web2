<?php

namespace App\Http\Requests\Rental;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'in:SUCCESS,FAILED,PENDING'],
            'transaction_ref' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
