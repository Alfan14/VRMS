<?php

namespace Database\Seeders;

use App\Models\Kantor;
use App\Models\Kendaraan;
use Illuminate\Database\Seeder;

class KendaraanSeeder extends Seeder
{
    public function run(): void
    {
        $kantor = Kantor::first();

        $vehicles = [
            [
                'kode_kendaraan' => 'DT001',
                'plat_nomor' => 'KT1001AA',
                'merk' => 'Toyota',
                'tipe' => 'Hilux',
                'tahun' => 2023,
            ],
            [
                'kode_kendaraan' => 'DT002',
                'plat_nomor' => 'KT1002AA',
                'merk' => 'Mitsubishi',
                'tipe' => 'Triton',
                'tahun' => 2024,
            ],
            [
                'kode_kendaraan' => 'LV001',
                'plat_nomor' => 'KT2001AA',
                'merk' => 'Toyota',
                'tipe' => 'Fortuner',
                'tahun' => 2023,
            ],
        ];

        foreach ($vehicles as $vehicle) {
            Kendaraan::create([
                ...$vehicle,
                'kantor_id' => $kantor->id,
                'warna' => 'Putih',
                'kapasitas_penumpang' => 5,
                'status' => 'AVAILABLE',
            ]);
        }
    }
}
