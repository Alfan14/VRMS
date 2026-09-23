<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class GoodReceiptTest extends TestCase
{
      use RefreshDatabase;

    public function test_grn_increases_stock()
    {
        // Route dilindungi auth:sanctum + role:admin
        Sanctum::actingAs(User::factory()->admin()->create(), ['*']);

        $supplier = Supplier::factory()->create();
        $product = Product::factory()->create(['stock' => 0]);

        $po = PurchaseOrder::factory()->create([
            'supplier_id' => $supplier->id
        ]);

        $response = $this->postJson('/api/purchasing/goods-receipts', [
            'po_id' => $po->id,
            'details' => [
                [
                    'product_id' => $product->id,
                    'qty_received' => 5,
                    'batch_no' => 'B001',
                    'expiry_date' => now()->addMonth()
                ]
            ]
        ]);

        // GoodReceiptController::store() mengembalikan 201 (resource created)
        $response->assertStatus(201);

        $this->assertDatabaseHas('inventory_batches', [
            'qty' => 5
        ]);

        $this->assertDatabaseHas('stock_mutations', [
            'type' => 'in_po'
        ]);
    }
}
