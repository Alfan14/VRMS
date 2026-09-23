<?php

namespace App\Http\Controllers;

use App\Models\Kantor;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Kantor\StoreKantorRequest;
use App\Http\Requests\Kantor\UpdateKantorRequest;

class KantorController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Kantor::with('wilayah')
                ->latest()
                ->get()
        ]);
    }

    public function store(StoreKantorRequest $request): JsonResponse {
        $kantor = Kantor::create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Kantor created successfully',
            'data' => $kantor->load('wilayah')
        ],201);
    }

    public function show(Kantor $kantor): JsonResponse {
        return response()->json([
            'success' => true,
            'data' => $kantor->load([
                'wilayah',
                'kendaraan',
                'pengemudi'
            ])
        ]);
    }

    public function update(UpdateKantorRequest $request, Kantor $kantor): JsonResponse {

        $kantor->update(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Kantor updated successfully',
            'data' => $kantor->fresh()->load('wilayah')
        ]);
    }

    public function destroy( Kantor $kantor): JsonResponse {
        $kantor->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kantor deleted successfully'
        ]);
    }
}
