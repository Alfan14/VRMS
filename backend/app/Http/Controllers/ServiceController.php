<?php

namespace App\Http\Controllers;

use App\Models\JadwalService;
use Illuminate\Http\JsonResponse;
use App\Services\VehicleService;
use App\Http\Requests\Service\StoreServiceRequest;
use App\Http\Requests\Service\CompleteServiceRequest;

class ServiceController extends Controller
{
    public function __construct(
        private VehicleService $vehicleService
    ) {}

    public function index(): JsonResponse
    {
        $data = JadwalService::with('kendaraan')
        ->latest()
        ->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function show( JadwalService $service): JsonResponse {
        return response()->json([
            'success' => true,
            'data' => $service->load(
                'kendaraan'
            )
        ]);
    }

    public function store( StoreServiceRequest $request): JsonResponse {
        $result = $this
            ->vehicleService
            ->create(
                $request->validated()
            );

        return response()->json([
            'success' => true,
            'message' => 'Service created successfully',
            'data' => $result
        ],201);
    }

    public function complete( CompleteServiceRequest $request, JadwalService $service): JsonResponse {

        $result = $this
            ->vehicleService
            ->complete(
                $service,
                $request->keterangan
            );

        return response()->json([
            'success' => true,
            'message' => 'Service completed successfully',
            'data' => $result
        ]);
    }

    public function start( JadwalService $service ): JsonResponse {

        $result = $this
            ->vehicleService
            ->start($service);

        return response()->json([
            'success' => true,
            'message' => 'Service started successfully',
            'data' => $result
        ]);
    }
}
