<?php

namespace App\Http\Requests\Kantor;

use Illuminate\Foundation\Http\FormRequest;

class StoreKantorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'wilayah_id' => [
                'required',
                'uuid',
                'exists:wilayah,id'
            ],

            'kode_kantor' => [
                'required',
                'string',
                'max:50',
                'unique:kantor,kode_kantor'
            ],

            'nama_kantor' => [
                'required',
                'string',
                'max:255'
            ],

            'alamat' => [
                'nullable',
                'string'
            ]
        ];
    }
}
