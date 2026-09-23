<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<TransactionDetail>
 */
class TransactionDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $qty = fake()->numberBetween(1, 10);
        $price = fake()->randomFloat(2, 1000, 500000);
        $discount = $this->faker->randomFloat(2, 0, 10);

        return [
             'id' => (string) Str::uuid(),
            'product_id' => Product::factory(),
            'qty' => $qty,
            'base_price' => $price,
            'discount' => $discount,
            'subtotal' => ($qty * $price) - $discount,
        ];
    }
}
