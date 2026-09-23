<?php

namespace App\Http\Requests\Kantor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateKantorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        $kantor = $this->route('kantor');

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
                Rule::unique('kantor','kode_kantor')
                    ->ignore($kantor->id)
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
