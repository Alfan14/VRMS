<?php

namespace App\Http\Controllers;

use App\Http\Requests\Driver\StoreDriverRequest;
use App\Http\Requests\Driver\UpdateDriverRequest;
use App\Models\Pengemudi;
use Illuminate\Http\JsonResponse;

class DriverController extends Controller
{
    public function index(): JsonResponse
    {
        $drivers = Pengemudi::query()
            ->with('kantor')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $drivers,
        ]);
    }

    public function show( Pengemudi $driver): JsonResponse {
        return response()->json([
            'success' => true,
            'data' => $driver->load('kantor'),
        ]);
    }

     public function store( StoreDriverRequest $request): JsonResponse {
        $driver = Pengemudi::create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Driver created successfully',
            'data' => $driver
        ], 201);
    }

    public function update( UpdateDriverRequest $request, Pengemudi $driver): JsonResponse {
        $driver->update(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Driver updated successfully',
            'data' => $driver->fresh()
        ]);
    }

    public function destroy( Pengemudi $driver): JsonResponse {
        $driver->delete();

        return response()->json([
            'success' => true,
            'message' => 'Driver deleted successfully'
        ]);
    }
}
