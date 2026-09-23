<?php

namespace Tests\Feature;

use App\Models\InventoryBatch;
use App\Models\Product;
use App\Models\Shift;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\ChartOfAccount;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    public function test_full_pos_transaction_flow()
    {
        // ID harus sama persis dengan config/accounts.php agar FK journal_entries.account_id valid
        ChartOfAccount::factory()->create([
            'id'           => '11111111-0000-0000-0000-000000001001',
            'type'         => 'asset',
            'account_code' => '1001',
            'name'         => 'Cash',
        ]);
        ChartOfAccount::factory()->create([
            'id'           => '11111111-0000-0000-0000-000000004001',
            'type'         => 'revenue',
            'account_code' => '4001',
            'name'         => 'Sales',
        ]);

        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);
        $shift = Shift::factory()->create(['user_id' => $user->id]);

        $product = Product::factory()->create(['price' => 10000, 'stock' => 10]);

        InventoryBatch::factory()->create([
            'product_id' => $product->id,
            'qty' => 10
        ]);

        $response = $this->postJson('/api/pos/transactions', [
            'user_id' => $user->id,
            'shift_id' => $shift->id,
            'payment_method' => 'cash',
            'items' => [
                [
                    'product_id' => $product->id,
                    'qty' => 2,
                    'discount' => 0
                ]
            ]
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('transactions', [
            'grand_total' => 20000
        ]);

        $this->assertDatabaseHas('stock_mutations', [
            'type' => 'out_sale'
        ]);

        $this->assertDatabaseHas('journal_entries', [
            'debit' => 20000
        ]);
    }
}
