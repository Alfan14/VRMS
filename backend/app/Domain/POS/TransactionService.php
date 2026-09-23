<?php

namespace App\Domain\POS;

use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Support\Str;

class TransactionService
{
    public function create(array $data)
    {
        return Transaction::create([
            'user_id' => $data['user_id'],
            'shift_id' => $data['shift_id'],
            'member_id' => $data['member_id'] ?? null,
            'invoice_no' => 'INV-' . now()->format('Ymd') . '-' . strtoupper(substr(str_replace('-', '', (string) Str::uuid()), 0, 8)),
            'grand_total' => 0,
            'payment_method' => $data['payment_method'],
            'is_synced' => 0,
        ]);
    }

    public function addDetail($trxId, $productId, $qty, $price)
    {
        $subtotal = $qty * $price;

        return TransactionDetail::create([
            'transaction_id' => $trxId,
            'product_id' => $productId,
            'qty' => $qty,
            'base_price' => $price,
            'discount' => 0,
            'subtotal' => $subtotal,
        ]);
    }
}
