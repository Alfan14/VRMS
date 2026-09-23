<?php

namespace Database\Seeders;

use App\Models\Kantor;
use App\Models\Wilayah;
use Illuminate\Database\Seeder;

class KantorSeeder extends Seeder
{
    public function run(): void
    {
        $kaltim = Wilayah::where('kode_wilayah', 'KALTIM')->first();

        Kantor::create([
            'wilayah_id' => $kaltim->id,
            'kode_kantor' => 'SITE-A',
            'nama_kantor' => 'Site A',
            'alamat' => 'Kutai Timur',
        ]);

        Kantor::create([
            'wilayah_id' => $kaltim->id,
            'kode_kantor' => 'SITE-B',
            'nama_kantor' => 'Site B',
            'alamat' => 'Samarinda',
        ]);
    }
}
