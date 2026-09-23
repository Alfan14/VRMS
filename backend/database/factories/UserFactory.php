<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),
            'username' => $this->faker->userName(),
            'pin' => $this->faker->unique()->numberBetween(1,6),
            'password' => bcrypt('password'),
            'role' => 'kasir',
        ];
    }

    public function superadmin()
    {
        return $this->state(fn () => [
            'role' => 'superadmin',
        ]);
    }

    public function admin()
    {
        return $this->state(fn () => [
            'role' => 'admin',
        ]);
    }

    public function kasir()
    {
        return $this->state(fn () => [
            'role' => 'kasir',
        ]);
    }

    public function manager()
    {
        return $this->state(fn () => [
            'role' => 'manager',
        ]);
    }
}
