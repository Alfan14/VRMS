<?php

namespace Database\Factories;

use App\Models\Journal;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Journal>
 */
class JournalFactory extends Factory
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
            'reference_id' => $this->faker->randomElement(['pos_sale','po_invoice','opname_adj']),
            'description' => $this->faker->sentence(),
            'date' => $this->faker->date(),
        ];
    }
}
