<?php

namespace App\Http\Requests\VehicleUsage;

use Illuminate\Foundation\Http\FormRequest;

class FinishVehicleUsageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'odometer_akhir' => [
                'required',
                'integer',
                'min:1'
            ],
            'catatan' => [
                'nullable',
                'string',
                'max:1000'
            ]
        ];
    }
}
