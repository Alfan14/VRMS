<?php

namespace App\Domain\Finance;

use App\Models\ChartOfAccount;
use App\Models\Journal;
use App\Models\JournalEntry;

class AccountingService
{
    public function recordSale($transaction)
    {
        $journal = Journal::create([
            'reference_id' => 'pos_sale',
            'description'  => 'POS Sale ' . $transaction->invoice_no,
            'date'         => now(),
        ]);

        $cashAccount    = config('accounts.cash');
        $revenueAccount = config('accounts.revenue');

        if (!$cashAccount || !$revenueAccount) {
            throw new \Exception('Accounts missing');
        }

        JournalEntry::create([
            'journal_id' => $journal->id,
            'account_id' => $cashAccount,
            'debit'      => $transaction->grand_total,
            'credit'     => 0,
        ]);

        JournalEntry::create([
            'journal_id' => $journal->id,
            'account_id' => $revenueAccount,
            'debit'      => 0,
            'credit'     => $transaction->grand_total,
        ]);
    }
}
