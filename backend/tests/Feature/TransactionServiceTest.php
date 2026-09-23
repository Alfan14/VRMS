<?php

namespace Tests\Feature;

use App\Application\UseCases\POS\CreateTransactionUseCase;
use App\Models\ChartOfAccount;
use App\Models\InventoryBatch;
use App\Models\Product;
use App\Models\Shift;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_transaction_calculates_total_correctly()
    {
        // TransactionService::create() by design hanya membuat header (grand_total = 0).
        // Kalkulasi total dilakukan oleh CreateTransactionUseCase setelah semua item diproses.
        // Test ini menggunakan UseCase agar assertion grand_total = 20000 valid.

        // AccountingService membutuhkan account ID yang sama persis dengan config/accounts.php
        ChartOfAccount::factory()->create([
            'id'   => '11111111-0000-0000-0000-000000001001',
            'type' => 'asset',
        ]);
        ChartOfAccount::factory()->create([
            'id'   => '11111111-0000-0000-0000-000000004001',
            'type' => 'revenue',
        ]);

        $product = Product::factory()->create(['price' => 10000, 'stock' => 10]);
        InventoryBatch::factory()->create([
            'product_id' => $product->id,
            'qty'        => 10,
        ]);
        $user  = User::factory()->create();
        $shift = Shift::factory()->create(['user_id' => $user->id]);

        $useCase = app(CreateTransactionUseCase::class);

        $trx = $useCase->execute([
            'user_id'        => $user->id,
            'shift_id'       => $shift->id,
            'payment_method' => 'cash',
            'items'          => [
                ['product_id' => $product->id, 'qty' => 2],
            ],
        ]);

        $this->assertEquals(20000, $trx->grand_total);
    }
}
