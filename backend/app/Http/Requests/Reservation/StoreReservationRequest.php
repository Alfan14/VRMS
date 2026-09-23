<?php

namespace App\Http\Requests\Reservation;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
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
                'exists:kendaraan,id',
            ],

            'pengemudi_id' => [
                'required',
                'uuid',
                'exists:pengemudi,id',
            ],

            'tujuan' => [
                'required',
                'string',
                'max:255',
            ],

            'keperluan' => [
                'required',
                'string',
            ],

            'tanggal_mulai' => [
                'required',
                'date',
                'after_or_equal:now',
            ],

            'tanggal_selesai' => [
                'required',
                'date',
                'after:tanggal_mulai',
            ],
        ];
    }
}
