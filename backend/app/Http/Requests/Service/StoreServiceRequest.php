<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [

            'kendaraan_id' => [
                'required',
                'uuid',
                'exists:kendaraan,id'
            ],

            'tanggal_service' => [
                'required',
                'date'
            ],

            'jenis_service' => [
                'required',
                'string',
                'max:255'
            ],

            'vendor' => [
                'nullable',
                'string',
                'max:255'
            ],

            'biaya' => [
                'nullable',
                'numeric',
                'min:0'
            ],

            'keterangan' => [
                'nullable',
                'string'
            ],

        ];
    }
}
