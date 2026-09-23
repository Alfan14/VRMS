<?php

namespace Database\Factories;

use App\Models\ChartOfAccount;
use App\Models\Journal;
use App\Models\JournalEntry;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<JournalEntry>
 */
class JournalEntryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $amount = $this->faker->randomFloat(2, 10, 1000);

        return [
            'id' => (string) Str::uuid(),
            'journal_id' => Journal::factory(),
            'account_id' => ChartOfAccount::factory(),
            'debit' => $amount,
            'credit' => 0,
        ];
    }
}
