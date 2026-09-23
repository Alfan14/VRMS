<?php

namespace App\Domain\Inventory;

use App\Models\GoodReceiptDetail;
use App\Models\InventoryBatch;
use App\Models\Product;
use App\Models\StockMutation;

class InventoryService
{
    public function addStockFromGRN(GoodReceiptDetail $detail)
    {
        // Ensure relationships exist
        $detail->loadMissing('goodReceipt.purchaseOrder');

        $receipt = $detail->goodReceipt;
        if (!$receipt) {
            throw new \Exception('GoodReceipt not found');
        }

        $po = $receipt->purchaseOrder;
        if (!$po) {
            throw new \Exception('PurchaseOrder not found');
        }

        $poDetail = $po->details()->where('product_id', $detail->product_id)->first();

        $batch = InventoryBatch::create([
            'product_id'  => $detail->product_id,
            'supplier_id' => $po->supplier_id,
            'batch_no'    => $detail->batch_no,
            'expiry_date' => $detail->expiry_date,
            'cost_price'  => $poDetail ? $poDetail->unit_cost : 0,
            'qty'         => $detail->qty_received,
        ]);

        Product::where('id', $detail->product_id)
            ->increment('stock', $detail->qty_received);

        StockMutation::create([
            'product_id' => $detail->product_id,
            'batch_id' => $batch->id,
            'type' => 'in_po',
            'qty_change' => $detail->qty_received,
            'reference_id' => $detail->grn_id,
        ]);
    }
    public function deductFIFO($productId, $qty, $referenceId)
    {
        $remaining = $qty;
        $totalCost = 0;

        $batches = InventoryBatch::where('product_id', $productId)
            ->where('qty', '>', 0)
            ->orderBy('expiry_date')
            ->lockForUpdate()
            ->get();

        foreach ($batches as $batch) {

            if ($remaining <= 0) break;

            $take = min($batch->qty, $remaining);

            $batch->decrement('qty', $take);

            StockMutation::create([
                'product_id' => $productId,
                'batch_id' => $batch->id,
                'type' => 'out_sale',
                'qty_change' => -$take,
                'reference_id' => $referenceId,
            ]);

            $totalCost += $take * $batch->cost_price;
            $remaining -= $take;
        }

        if ($remaining > 0) {
            throw new \Exception('Insufficient stock');
        }

        // update product stock
        Product::where('id', $productId)->decrement('stock', $qty);

        return [
            'price' => $this->getSellingPrice($productId)
        ];
    }

    private function getSellingPrice($productId)
    {
        return Product::findOrFail($productId)->price;
    }
}
