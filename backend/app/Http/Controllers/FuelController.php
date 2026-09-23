<?php

namespace App\Http\Controllers;

use App\Models\CatatanBbm;
use Illuminate\Http\JsonResponse;
use App\Services\FuelService;
use App\Http\Requests\Fuel\StoreFuelRecordRequest;

class FuelController extends Controller
{
    public function __construct(
        private FuelService $fuelService
    ) {}

    public function store(
        StoreFuelRecordRequest $request
    ): JsonResponse {

        $fuel = $this->fuelService->store(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Fuel record created successfully',
            'data' => $fuel,
        ]);
    }

    public function show(
        CatatanBbm $fuel
    ): JsonResponse {

        return response()->json([
            'success' => true,
            'data' => $this->fuelService->show($fuel),
        ]);
    }

    public function index(): JsonResponse
    {
        $records = CatatanBbm::query()
            ->with([
                'penggunaan',
                'penggunaan.reservasi',
                'penggunaan.reservasi.kendaraan',
            ])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $records,
        ]);
    }
}
