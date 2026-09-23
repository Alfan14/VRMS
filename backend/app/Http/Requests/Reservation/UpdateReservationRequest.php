<?php

namespace App\Http\Requests\Reservation;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReservationRequest extends FormRequest
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
                'exists:kendaraan,id'
            ],

            'pengemudi_id' => [
                'required',
                'exists:pengemudi,id'
            ],

            'tanggal_mulai' => [
                'required',
                'date'
            ],

            'tanggal_selesai' => [
                'required',
                'date',
                'after:tanggal_mulai'
            ],

            'tujuan' => [
                'required',
                'string'
            ],

            'keperluan' => [
                'required',
                'string'
            ],
        ];
    }
}
