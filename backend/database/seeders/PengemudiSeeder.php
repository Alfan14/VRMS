<?php

namespace Database\Seeders;

use App\Models\Kantor;
use App\Models\Pengemudi;
use Illuminate\Database\Seeder;

class PengemudiSeeder extends Seeder
{
    public function run(): void
    {
        $kantor = Kantor::first();

        $drivers = [
            [
                'nama' => 'Budi Santoso',
                'no_hp' => '081111111111',
                'sim_nomor' => 'SIM001',
            ],
            [
                'nama' => 'Andi Saputra',
                'no_hp' => '082222222222',
                'sim_nomor' => 'SIM002',
            ],
            [
                'nama' => 'Joko Susilo',
                'no_hp' => '083333333333',
                'sim_nomor' => 'SIM003',
            ],
        ];

        foreach ($drivers as $driver) {
            Pengemudi::create([
                ...$driver,
                'kantor_id' => $kantor->id,
                'sim_expired' => now()->addYears(5),
                'status' => 'AVAILABLE',
            ]);
        }
    }
}
