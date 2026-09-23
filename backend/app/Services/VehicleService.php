<?php

namespace App\Services;

use App\Models\Kendaraan;
use App\Models\JadwalService;
use App\Enums\ServiceStatus;
use App\Enums\VehicleStatus;
use App\Enums\ActivityModule;
use App\Enums\ActivityAction;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class VehicleService
{
    public function __construct(
        private ActivityLogService $activityLogService
    ) {}

    public function create( array $data): JadwalService {
        return DB::transaction(function () use ($data) {
            $vehicle = Kendaraan::findOrFail(
                $data['kendaraan_id']
            );
            if (
                $vehicle->status !== VehicleStatus::AVAILABLE
            ) {
                throw ValidationException::withMessages([
                    'kendaraan_id' => [
                        'Vehicle not available'
                    ]
                ]);
            }

            $service = JadwalService::create([
                'kendaraan_id' => $data['kendaraan_id'],
                'tanggal_service' => $data['tanggal_service'],
                'jenis_service' => $data['jenis_service'],
                'vendor' => $data['vendor'] ?? null,
                'biaya' => $data['biaya'] ?? 0,
                'keterangan' => $data['keterangan'] ?? null,
                'status' => ServiceStatus::SCHEDULED,
            ]);

            $vehicle->update(['status' => VehicleStatus::SERVICE]);

            $this->activityLogService->log(
                ActivityModule::SERVICE,
                ActivityAction::CREATE,
                $service->id,
                null,
                $service->toArray()
            );
            return $service->load('kendaraan');
        });
    }

    public function start(  JadwalService $service): JadwalService {
        if (
            $service->status !== ServiceStatus::SCHEDULED
        ) {
            abort(
                422,'Service already started'
            );
        }

        $service->update([
            'status' => ServiceStatus::IN_PROGRESS
        ]);

        $service->kendaraan->update([
            'status' => VehicleStatus::SERVICE
        ]);
        return $service->fresh([
            'kendaraan'
        ]);
    }

    public function complete( JadwalService $service,?string $keterangan = null): JadwalService {
        return DB::transaction(function () use (
            $service,
            $keterangan
        ) {
            $service->refresh();
            if (
                $service->status === ServiceStatus::COMPLETED
            ) {
                throw ValidationException::withMessages([
                    'service' => [
                        'Service already completed'
                    ]
                ]);
            }

            $oldData = $service->toArray();
            $service->update([
                'status' => ServiceStatus::COMPLETED,
                'keterangan' => $keterangan
            ]);

            $service
                ->kendaraan
                ->update([
                    'status' => VehicleStatus::AVAILABLE
                ]);

            $this->activityLogService->log(
                ActivityModule::SERVICE,
                ActivityAction::UPDATE,
                $service->id,
                $oldData,
                $service->fresh()->toArray()
            );

            return $service->fresh([
                'kendaraan'
            ]);
        });
    }
}
