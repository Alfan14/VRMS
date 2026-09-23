<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\MemberTier;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Member>
 */
class MemberFactory extends Factory
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
            'tier_id' => MemberTier::factory(),
            'name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'points' => $this->faker->numberBetween(0, 2000),
        ];
    }
}
