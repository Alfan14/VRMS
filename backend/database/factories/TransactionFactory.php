<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\Shift;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),
            'user_id' => User::factory(),
            'shift_id' => Shift::factory(),
            'member_id' => $this->faker->optional()->passthrough(Member::factory()),
            'invoice_no' => strtoupper($this->faker->bothify('INV-#####')),
            'grand_total' => 0,
            'payment_method' => $this->faker->randomElement(['cash','qris','debit']),
            'is_synced' => false,
        ];
    }
}
