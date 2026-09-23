<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use App\Models\Product;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ApiTransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['user', 'member', 'details.product'])
            ->latest('created_at');

        if ($request->filled('is_synced')) {
            $query->where('is_synced', (bool) $request->is_synced);
        }
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        return response()->json([
            'success' => true,
            'data' => $query->paginate($request->per_page ?? 15)
        ]);
    }

    public function show($id)
    {
        $transaction = Transaction::findOrFail($id);
        return new TransactionResource($transaction);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|uuid|exists:users,id',
            'member_id' => 'nullable|uuid|exists:members,id',
            'payment_method' => 'required|in:cash,debit,credit,qris,transfer',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|uuid|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price_at_sale' => 'required|numeric|min:0',
            'created_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $totalAmount = 0;
            $details = [];

            // Validate stock & calculate totals
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                if ($product->stock < $item['qty']) {
                    throw new \Exception("Stok {$product->name} tidak mencukupi. Tersisa: {$product->stock}");
                }
                $subtotal = round($item['qty'] * $item['price_at_sale'], 2);
                $totalAmount += $subtotal;
                $details[] = [
                    'product_id' => $product->id,
                    'qty' => $item['qty'],
                    'price_at_sale' => $item['price_at_sale'],
                    'subtotal' => $subtotal
                ];
            }

            // Create Transaction Header
            $transaction = Transaction::create([
                'user_id' => $request->user_id,
                'member_id' => $request->member_id ?? null,
                'total_amount' => round($totalAmount, 2),
                'payment_method' => $request->payment_method,
                'is_synced' => true,
                'created_at' => $request->created_at ?? now()
            ]);

            // Buat Detail & Kurangi Stok
            foreach ($details as $detail) {
                $transaction->details()->create($detail);
                Product::find($detail['product_id'])->decrement('stock', $detail['qty']);
            }

            // Perbarui Poin Anggota
            if ($request->member_id) {
                $pointsToAdd = floor($totalAmount / 1000);
                Member::find($request->member_id)->increment('points', $pointsToAdd);
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil dibuat',
                'data' => $transaction->load('details.product', 'user', 'member')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    // Endpoint khusus untuk upload transaksi offline dari POS
    public function sync(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'transactions' => 'required|array|min:1',
            'transactions.*' => 'array' // Each follows store validation
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $results = [];
        foreach ($request->transactions as $txData) {
            $txData['is_synced'] = true; // Mark as synced after upload
            $response = $this->store(new Request($txData));
            $results[] = json_decode($response->getContent(), true);
        }

        return response()->json([
            'success' => true,
            'message' => count($results) . ' transaksi berhasil disinkronkan',
            'data' => $results
        ]);
    }
}
