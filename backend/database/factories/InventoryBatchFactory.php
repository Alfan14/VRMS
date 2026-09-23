<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\Product;
use App\Models\InventoryBatch;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;


/**
 * @extends Factory<InventoryBatch>
 */
class InventoryBatchFactory extends Factory
{
    public function definition(): array
    {
        return [
             'id' => (string) Str::uuid(),
            'product_id' => Product::factory(),
            'supplier_id' => Supplier::factory(),
            'batch_no' => strtoupper($this->faker->bothify('BATCH-####')),
            'expiry_date' => $this->faker->date(),
            'cost_price' => $this->faker->randomFloat(2, 10, 200),
            'qty' => $this->faker->numberBetween(10, 100),
        ];
    }
}
