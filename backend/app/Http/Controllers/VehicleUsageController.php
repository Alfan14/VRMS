<?php

namespace App\Http\Controllers;

use App\Models\PenggunaanKendaraan;
use Illuminate\Http\JsonResponse;
use App\Services\VehicleUsageService;
use App\Http\Requests\VehicleUsage\StartVehicleUsageRequest;
use App\Http\Requests\VehicleUsage\FinishVehicleUsageRequest;

class VehicleUsageController extends Controller
{
    public function __construct(
        private VehicleUsageService $vehicleUsageService
    ) {}

    public function start(
        StartVehicleUsageRequest $request
    ): JsonResponse {

        $usage = $this
            ->vehicleUsageService
            ->start(
                $request->reservasi_id,
                $request->odometer_awal
            );

        return response()->json([
            'success' => true,
            'message' => 'Vehicle usage started',
            'data' => $usage,
        ]);
    }

    public function finish(
        FinishVehicleUsageRequest $request,
        PenggunaanKendaraan $usage
    ): JsonResponse {

        $result = $this
            ->vehicleUsageService
            ->finish(
                $usage,
                $request->odometer_akhir,
                $request->catatan
            );

        return response()->json([
            'success' => true,
            'message' => 'Vehicle usage completed',
            'data' => $result,
        ]);
    }

    public function index(): JsonResponse
    {
        $data = PenggunaanKendaraan::query()
            ->with([
                'reservasi',
                'reservasi.kendaraan',
                'reservasi.pengemudi',
                'bbm',
            ])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
    public function show( PenggunaanKendaraan $usage ): JsonResponse {
        return response()->json([
            'success' => true,
            'data' => $usage->load([
                'reservasi',
                'reservasi.kendaraan',
                'reservasi.pengemudi',
                'bbm',
            ]),
        ]);
    }

}
