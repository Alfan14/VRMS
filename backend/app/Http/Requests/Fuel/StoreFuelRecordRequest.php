<?php

namespace App\Http\Requests\Fuel;

use Illuminate\Foundation\Http\FormRequest;

class StoreFuelRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'penggunaan_id' => [
                'required',
                'uuid',
                'exists:penggunaan_kendaraan,id'
            ],

            'tanggal' => [
                'required',
                'date'
            ],

            'liter' => [
                'required',
                'numeric',
                'gt:0'
            ],

            'harga_per_liter' => [
                'required',
                'numeric',
                'gt:0'
            ],

            'spbu' => [
                'required',
                'string',
                'max:255'
            ],

            'catatan' => [
                'nullable',
                'string',
                'max:1000'
            ]
        ];
    }
}
