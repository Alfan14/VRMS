<?php

namespace Tests\Feature;

use App\Domain\Finance\AccountingService;
use App\Models\ChartOfAccount;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountingServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_journal_balanced()
    {
        // ID harus sama persis dengan config/accounts.php agar FK journal_entries.account_id valid
        ChartOfAccount::factory()->create([
            'id'   => '11111111-0000-0000-0000-000000001001',
            'type' => 'asset',
        ]);
        ChartOfAccount::factory()->create([
            'id'   => '11111111-0000-0000-0000-000000004001',
            'type' => 'revenue',
        ]);

        $trx = Transaction::factory()->create(['grand_total' => 50000]);

        $service = new AccountingService();
        $service->recordSale($trx);

        $this->assertDatabaseCount('journal_entries', 2);
    }
}
