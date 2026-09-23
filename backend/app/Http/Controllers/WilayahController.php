<?php

namespace App\Http\Controllers;

use App\Models\Wilayah;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Wilayah\StoreWilayahRequest;
use App\Http\Requests\Wilayah\UpdateWilayahRequest;

class WilayahController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Wilayah::latest()->get(),
        ]);
    }

    public function store(
        StoreWilayahRequest $request
    ): JsonResponse {

        $wilayah = Wilayah::create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Wilayah created successfully',
            'data' => $wilayah,
        ], 201);
    }

    public function show(
        Wilayah $wilayah
    ): JsonResponse {

        return response()->json([
            'success' => true,
            'data' => $wilayah,
        ]);
    }

    public function update(
        UpdateWilayahRequest $request,
        Wilayah $wilayah
    ): JsonResponse {

        $wilayah->update(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Wilayah updated successfully',
            'data' => $wilayah->fresh(),
        ]);
    }

    public function destroy(
        Wilayah $wilayah
    ): JsonResponse {

        $wilayah->delete();

        return response()->json([
            'success' => true,
            'message' => 'Wilayah deleted successfully',
        ]);
    }
}
