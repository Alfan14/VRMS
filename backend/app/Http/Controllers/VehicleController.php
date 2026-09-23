<?php

namespace App\Http\Controllers;

use App\Models\Kendaraan;
use App\Enums\VehicleStatus;
use App\Enums\ActivityAction;
use App\Enums\ActivityModule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\ActivityLogService;

class VehicleController extends Controller
{
    public function __construct(
        private ActivityLogService $activityLogService
    ) {}

    public function index(): JsonResponse
    {
        $vehicles = Kendaraan::query()
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $vehicles,
        ]);
    }

    public function available(): JsonResponse
    {
        $vehicles = Kendaraan::query()
            ->where('status', VehicleStatus::AVAILABLE)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $vehicles,
        ]);
    }

    public function show(
        Kendaraan $vehicle
    ): JsonResponse {

        return response()->json([
            'success' => true,
            'data' => $vehicle,
        ]);
    }

    public function store(
        Request $request
    ): JsonResponse {

        $validated = $request->validate([
            'kantor_id' => ['required', 'uuid'],
            'kode_kendaraan' => ['required', 'string', 'max:100'],
            'plat_nomor' => ['required', 'string', 'max:100'],
            'merk' => ['required', 'string'],
            'tipe' => ['required', 'string'],
            'tahun' => ['required'],
            'warna' => ['required', 'string'],
            'kapasitas_penumpang' => ['required', 'integer'],
        ]);

        $vehicle = Kendaraan::create([
            ...$validated,
            'status' => VehicleStatus::AVAILABLE,
        ]);

        $this->activityLogService->log(
            ActivityModule::VEHICLE,
            ActivityAction::CREATE,
            $vehicle->id,
            null,
            $vehicle->toArray()
        );

        return response()->json([
            'success' => true,
            'message' => 'Vehicle created successfully',
            'data' => $vehicle,
        ], 201);
    }

    public function update(
        Request $request,
        Kendaraan $vehicle
    ): JsonResponse {

        $oldData = $vehicle->toArray();

        $validated = $request->validate([
            'kantor_id' => ['sometimes', 'uuid'],
            'kode_kendaraan' => ['sometimes', 'string'],
            'plat_nomor' => ['sometimes', 'string'],
            'merk' => ['sometimes', 'string'],
            'tipe' => ['sometimes', 'string'],
            'tahun' => ['sometimes'],
            'warna' => ['sometimes', 'string'],
            'kapasitas_penumpang' => ['sometimes', 'integer'],
            'status' => ['sometimes', 'string'],
        ]);

        $vehicle->update($validated);

        $this->activityLogService->log(
            ActivityModule::VEHICLE,
            ActivityAction::UPDATE,
            $vehicle->id,
            $oldData,
            $vehicle->fresh()->toArray()
        );

        return response()->json([
            'success' => true,
            'message' => 'Vehicle updated successfully',
            'data' => $vehicle->fresh(),
        ]);
    }

    public function destroy(
        Kendaraan $vehicle
    ): JsonResponse {

        $oldData = $vehicle->toArray();

        $vehicle->delete();

        $this->activityLogService->log(
            ActivityModule::VEHICLE,
            ActivityAction::DELETE,
            $oldData['id'],
            $oldData,
            null
        );

        return response()->json([
            'success' => true,
            'message' => 'Vehicle deleted successfully',
        ]);
    }
}
