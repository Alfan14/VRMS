<?php

namespace Database\Factories;

use App\Models\PurchaseOrder;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PurchaseOrder>
 */
class PurchaseOrderFactory extends Factory
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
            'supplier_id' => Supplier::factory(),
            'po_number' => strtoupper($this->faker->bothify('PO-#####')),
            'expected_date' => $this->faker->date(),
            'status' => $this->faker->randomElement(['draft','sent','done']),
        ];
    }
}
