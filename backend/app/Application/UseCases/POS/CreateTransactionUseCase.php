<?php

namespace App\Application\UseCases\POS;

use App\Domain\POS\TransactionService;
use App\Domain\Inventory\InventoryService;
use App\Domain\Finance\AccountingService;
use Illuminate\Support\Facades\DB;

class CreateTransactionUseCase
{
    public function __construct(
        protected TransactionService $transactionService,
        protected InventoryService $inventoryService,
        protected AccountingService $accountingService
    ) {}

    public function execute(array $data)
    {
        return DB::transaction(function () use ($data) {

            // 1. Create transaction
            $transaction = $this->transactionService->create($data);

            $total = 0;

            // 2. Process items
            foreach ($data['items'] as $item) {

                $result = $this->inventoryService->deductFIFO(
                    $item['product_id'],
                    $item['qty'],
                    $transaction->id
                );

                $detail = $this->transactionService->addDetail(
                    $transaction->id,
                    $item['product_id'],
                    $item['qty'],
                    $result['price']
                );

                $total += $detail->subtotal;
            }

            // 3. Update total
            $transaction->update([
                'grand_total' => $total
            ]);

            // 4. Accounting
            $this->accountingService->recordSale($transaction);

            return $transaction;
        });
    }
}
