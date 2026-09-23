<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\CatatanBbm;
use App\Models\JadwalService;
use App\Models\Kendaraan;
use App\Models\ReservasiKendaraan;
use App\Enums\VehicleStatus;
use App\Enums\ReservationStatus;
use App\Enums\ServiceStatus;

class DashboardService
{
    public function summary(): array
    {
        return [

            'vehicles' => [
                'total' => Kendaraan::count(),

                'available' => Kendaraan::where(
                    'status',
                    VehicleStatus::AVAILABLE
                )->count(),

                'in_use' => Kendaraan::where(
                    'status',
                    VehicleStatus::IN_USE
                )->count(),

                'service' => Kendaraan::where(
                    'status',
                    VehicleStatus::SERVICE
                )->count(),
            ],

            'reservations' => [
                'total' => ReservasiKendaraan::count(),

                'pending_lv1' => ReservasiKendaraan::where(
                    'status',
                    ReservationStatus::PENDING_LV1
                )->count(),

                'pending_lv2' => ReservasiKendaraan::where(
                    'status',
                    ReservationStatus::PENDING_LV2
                )->count(),

                'approved' => ReservasiKendaraan::where(
                    'status',
                    ReservationStatus::APPROVED
                )->count(),

                'rejected' => ReservasiKendaraan::where(
                    'status',
                    ReservationStatus::REJECTED
                )->count(),
            ],

            'fuel' => [
                'total_records' => CatatanBbm::count(),

                'total_liter' => CatatanBbm::sum(
                    'liter'
                ),

                'total_cost' => CatatanBbm::sum(
                    'total_biaya'
                ),
            ],

            'services' => [
                'scheduled' => JadwalService::where(
                    'status',
                    ServiceStatus::SCHEDULED
                )->count(),

                'completed' => JadwalService::where(
                    'status',
                    ServiceStatus::COMPLETED
                )->count(),
            ],
        ];
    }

    public function recentActivities()
    {
        return ActivityLog::query()
            ->with('user')
            ->latest()
            ->limit(20)
            ->get();
    }
}
