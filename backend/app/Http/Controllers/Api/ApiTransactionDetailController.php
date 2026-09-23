<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;

class ApiTransactionDetailController extends Controller
{

    public function index()
    {
        $transaction_detail_details = TransactionDetail::all();
        return view('transaction_details.index', ['transaction_details' => $transaction_detail_details]);
    }
    public function create()
    {
        $transaction_detail_details = TransactionDetail::all();
        return view('transaction_details.create');
    }

    public function store(Request $request)
    {
        $validateData = $request->validate([
            'transaction_id' => 'required',
            'product_id' => 'required',
            'qty' => 'required',
            'price_at_sale' => 'required',
            'subtotal' => 'required',
        ]);

        $transaction_detail = new TransactionDetail();
        $transaction_detail->transaction_id = $validateData['transaction_id'];
        $transaction_detail->product_id = $validateData['product_id'];
        $transaction_detail->qty = $validateData['qty'];
        $transaction_detail->price_at_sale = $validateData['price_at_sale'];
        $transaction_detail->subtotal= $validateData['subtotal'];
        $transaction_detail->save();

        return redirect()->route('transaction_details.index');
    }

    public function edit($id)
    {
        $transaction_detail = TransactionDetail::findOrFail($id); // Mengambil data buku berdasarkan ID
        return view('transaction_details.edit', ['book' => $transaction_detail]);
    }

    public function update(Request $request, $id)
    {
        $validateData = $request->validate([
            'transaction_id' => 'required',
            'product_id' => 'required',
            'qty' => 'required',
            'price_at_sale' => 'required',
            'subtotal' => 'required',
        ]);

        $transaction_detail = TransactionDetail::findOrFail($id);
        $transaction_detail->transaction_id = $validateData['transaction_id'];
        $transaction_detail->product_id = $validateData['product_id'];
        $transaction_detail->qty = $validateData['qty'];
        $transaction_detail->price_at_sale = $validateData['price_at_sale'];
        $transaction_detail->subtotal= $validateData['subtotal'];
        $transaction_detail->save();

        return redirect()->route('transaction_details.index');
    }

    public function destroy($id)
    {
        $transaction_detail = TransactionDetail::findOrFail($id);
        $transaction_detail->delete();

        return redirect()->route('transaction_details.index');
    }
}
