<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderDetail;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PurchaseOrderDetail>
 */
class PurchaseOrderDetailFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),
            'po_id' => PurchaseOrder::factory(),
            'product_id' => Product::factory(),
            'qty_ordered' => $this->faker->numberBetween(1, 50),
            'unit_cost' => $this->faker->randomFloat(2, 2, 200),
        ];
    }
}
