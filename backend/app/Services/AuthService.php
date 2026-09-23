<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function login(
        string $username,
        string $password
    ): array {

        $user = User::where(
            'username',
            $username
        )->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'username' => ['Invalid credentials']
            ]);
        }

        if (!Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Invalid credentials']
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'account' => ['Account disabled']
            ]);
        }

        $user->update([
            'last_login_at' => now()
        ]);

        $token = $user->createToken(
            'vehicle-reservation'
        )->plainTextToken;

        return [
            'token' => $token,
            'user' => $user
        ];
    }
}
