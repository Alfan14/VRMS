<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class ApiProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->latest();

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('barcode', $request->search);
            });
        }
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('low_stock')) {
            $query->whereColumn('stock', '<=', 'min_stock');
        }

        return response()->json(['success' => true, 'data' => $query->paginate(20)]);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        return new ProductResource($product);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|uuid|exists:categories,id',
            'barcode' => 'required|string|unique:products,barcode',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'required|integer|min:0'
        ]);

        return response()->json([
            'success' => true,
            'data' => Product::create($validated)
        ], 201);
    }

    public function update(Request $request, Product $product)
    {
        if (!$product->exists) {
            return response()->json(['error' => 'Produk tidak ditemukan, Route Binding gagal!'], 404);
        }

        DB::listen(function ($query) {
        // Memfilter hanya query yang berhubungan dengan tabel products
        if (str_contains($query->sql, 'products')) {
                Log::info('Query Validasi Produk:', [
                    'sql' => $query->sql,
                    'bindings' => $query->bindings
                ]);
            }
        });

        $validated = $request->validate([
            'category_id' => 'sometimes|uuid|exists:categories,id',
            'barcode' => [
                'sometimes',
                'string',
                Rule::unique('products', 'barcode')->ignore($product)
            ],
            'name'        => 'sometimes|string|max:255',
            'price'       => 'sometimes|numeric|min:0',
            'stock'       => 'sometimes|integer|min:0',
            'min_stock'   => 'sometimes|integer|min:0'
        ]);

        $product->update($validated);

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['success' => true, 'message' => 'Produk dihapus']);
    }
}
