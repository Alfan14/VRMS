<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Kantor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $kantor = Kantor::first();

        User::create([
            'nama' => 'System Admin',
            'username' => 'admin',
            'email' => 'admin@vehicle.test',
            'password' => Hash::make('password123'),
            'pin' => '123456',
            'role' => 'ADMIN',
            'wilayah_id' => $kantor->wilayah_id,
            'kantor_id' => $kantor->id,
        ]);

        User::create([
            'nama' => 'Kepala Operasional',
            'username' => 'operasional',
            'email' => 'operasional@vehicle.test',
            'password' => Hash::make('password123'),
            'pin' => '123456',
            'role' => 'KEPALA_OPERASIONAL',
            'wilayah_id' => $kantor->wilayah_id,
            'kantor_id' => $kantor->id,
        ]);

        User::create([
            'nama' => 'Manager',
            'username' => 'manager',
            'email' => 'manager@vehicle.test',
            'password' => Hash::make('password123'),
            'pin' => '123456',
            'role' => 'MANAGER',
            'wilayah_id' => $kantor->wilayah_id,
            'kantor_id' => $kantor->id,
        ]);
    }
}
