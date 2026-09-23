<?php

namespace Database\Factories;

use App\Models\InventoryBatch;
use App\Models\Product;
use App\Models\StockMutation;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<StockMutation>
 */
class StockMutationFactory extends Factory
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
            'batch_id' => InventoryBatch::factory(),
            'type' => $this->faker->randomElement(['in_po','out_sale','out_exp','adj']),
            'qty_change' => $this->faker->numberBetween(1, 50),
            'reference_id' => (string) Str::uuid(),
        ];
    }
}
