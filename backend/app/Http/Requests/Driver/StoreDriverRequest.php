<?php

namespace App\Http\Requests\Driver;

use Illuminate\Foundation\Http\FormRequest;

class StoreDriverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'kantor_id' => [
                'required',
                'exists:kantor,id'
            ],
            'nama' => [
                'required',
                'string',
                'max:255'
            ],
            'no_hp' => [
                'required',
                'string',
                'max:20'
            ],
            'sim_nomor' => [
                'required',
                'string',
                'max:100'
            ],
            'sim_expired' => [
                'required',
                'date'
            ],
            'status' => [
                'required',
                'in:AVAILABLE,ASSIGNED,OFF'
            ]
        ];
    }
}
