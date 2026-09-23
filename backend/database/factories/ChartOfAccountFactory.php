<?php

namespace Database\Factories;

use App\Models\ChartOfAccount;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ChartOfAccount>
 */
class ChartOfAccountFactory extends Factory
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
            'account_code' => $this->faker->unique()->numerify('1###'),
            'name' => $this->faker->word(),
            'type' => $this->faker->randomElement([
                'asset','liability','equity','revenue','expense'
            ]),
        ];
    }
}
