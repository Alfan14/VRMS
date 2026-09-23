<?php

namespace Database\Factories;

use App\Models\GoodReceipt;
use App\Models\PurchaseOrder;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<GoodReceipt>
 */
class GoodReceiptFactory extends Factory
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
            'po_id' => PurchaseOrder::factory(),
            'receipt_no' => strtoupper($this->faker->bothify('GRN-#####')),
            'received_at' => now(),
        ];
    }
}
