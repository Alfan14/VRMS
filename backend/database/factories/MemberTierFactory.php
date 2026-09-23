<?php

namespace Database\Factories;

use App\Models\MemberTier;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<MemberTier>
 */
class MemberTierFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),
            'name' => $this->faker->randomElement(['Bronze', 'Silver', 'Gold']),
            'min_points' => $this->faker->numberBetween(0, 1000),
            'discount_percent' => $this->faker->randomFloat(2, 0, 20),
        ];
    }
}
