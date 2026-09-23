<?php

namespace App\Services;

use App\Models\CatatanBbm;
use App\Models\PenggunaanKendaraan;
use App\Enums\UsageStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class FuelService
{
    public function store(
        array $data
    ): CatatanBbm {

        return DB::transaction(function () use ($data) {

            $usage = PenggunaanKendaraan::findOrFail(
                $data['penggunaan_id']
            );

            if (
                $usage->status !== UsageStatus::IN_PROGRESS
            ) {
                throw ValidationException::withMessages([
                    'penggunaan_id' => [
                        'Fuel record only allowed for active usage'
                    ]
                ]);
            }

            $totalBiaya = $data['liter'] * $data['harga_per_liter'];

            return CatatanBbm::create([
                'penggunaan_id' => $usage->id,
                'tanggal' => $data['tanggal'],
                'liter' => $data['liter'],
                'harga_per_liter' => $data['harga_per_liter'],
                'total_biaya' => $totalBiaya,
                'spbu' => $data['spbu'],
                'catatan' => $data['catatan'] ?? null,
            ]);
        });
    }

    public function show(
        CatatanBbm $fuel
    ): CatatanBbm {

        return $fuel->load([
            'penggunaan',
            'penggunaan.reservasi'
        ]);
    }
}
