<?php

namespace Database\Factories;

use App\Models\GoodReceiptDetail;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<GoodReceiptDetail>
 */
class GoodReceiptDetailFactory extends Factory
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
            'product_id' => Product::factory(),
            'qty_received' => $this->faker->numberBetween(5, 50),
            'batch_no' => strtoupper($this->faker->bothify('BATCH-####')),
            'expiry_date' => $this->faker->date(),
        ];
    }
}
