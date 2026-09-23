<?php

namespace App\Http\Requests\VehicleUsage;

use Illuminate\Foundation\Http\FormRequest;

class StartVehicleUsageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reservasi_id' => [
                'required',
                'uuid',
                'exists:reservasi_kendaraan,id'
            ],
            'odometer_awal' => [
                'required',
                'integer',
                'min:0'
            ],
        ];
    }
}
