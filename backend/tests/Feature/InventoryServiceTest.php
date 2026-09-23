<?php

namespace Tests\Feature;

use App\Domain\Inventory\InventoryService;
use App\Models\InventoryBatch;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_fifo_stock_deduction()
    {
        $product = Product::factory()->create(['stock' => 10]);

        InventoryBatch::factory()->create([
            'product_id' => $product->id,
            'qty' => 5,
            'expiry_date' => now()->addDays(1)
        ]);

        InventoryBatch::factory()->create([
            'product_id' => $product->id,
            'qty' => 5,
            'expiry_date' => now()->addDays(10)
        ]);

        $trx = Transaction::factory()->create();

        $detail = TransactionDetail::factory()->create([
            'transaction_id' => $trx->id,
            'product_id' => $product->id,
            'qty' => 6
        ]);

        $trx->load('details');

        // deductFromTransaction() sudah dihapus; interface baru adalah deductFIFO() per item
        $service = new InventoryService();
        foreach ($trx->details as $detail) {
            $service->deductFIFO($detail->product_id, $detail->qty, $trx->id);
        }

        $this->assertDatabaseHas('inventory_batches', [
            'qty' => 0
        ]);
    }
}
