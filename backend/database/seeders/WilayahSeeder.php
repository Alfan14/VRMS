<?php

namespace Database\Seeders;

use App\Models\Wilayah;
use Illuminate\Database\Seeder;

class WilayahSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'kode_wilayah' => 'KALTIM',
                'nama_wilayah' => 'Kalimantan Timur',
            ],
            [
                'kode_wilayah' => 'KALSEL',
                'nama_wilayah' => 'Kalimantan Selatan',
            ],
            [
                'kode_wilayah' => 'KALTENG',
                'nama_wilayah' => 'Kalimantan Tengah',
            ],
        ];

        foreach ($data as $item) {
            Wilayah::create($item);
        }
    }
}
