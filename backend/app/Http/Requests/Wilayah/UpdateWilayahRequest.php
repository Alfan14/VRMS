<?php

namespace App\Http\Requests\Wilayah;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWilayahRequest extends FormRequest
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
                Rule::unique(
                    'wilayah',
                    'kode_wilayah'
                )->ignore(
                    $this->wilayah->id
                ),
            ],

            'nama_wilayah' => [
                'required',
                'string',
                'max:255',
            ],
        ];
    }
}
