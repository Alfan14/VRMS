<?php

namespace App\Http\Requests\Wilayah;

use Illuminate\Foundation\Http\FormRequest;

class StoreWilayahRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kode_wilayah' => [
                'required',
                'string',
                'max:50',
                'unique:wilayah,kode_wilayah',
            ],

            'nama_wilayah' => [
                'required',
                'string',
                'max:255',
            ],
        ];
    }
}
