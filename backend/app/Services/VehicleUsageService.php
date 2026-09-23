<?php

namespace App\Services;

use App\Models\PenggunaanKendaraan;
use App\Models\ReservasiKendaraan;
use App\Enums\UsageStatus;
use App\Enums\VehicleStatus;
use App\Enums\ReservationStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class VehicleUsageService
{
    public function start(
        string $reservasiId,
        int $odometerAwal
    ): PenggunaanKendaraan {

        return DB::transaction(function () use (
            $reservasiId,
            $odometerAwal
        ) {

            $reservation = ReservasiKendaraan::with(
                'kendaraan'
            )->findOrFail($reservasiId);

            if (
                $reservation->status !== ReservationStatus::APPROVED
            ) {
                throw ValidationException::withMessages([
                    'reservation' => [
                        'Reservation not approved'
                    ]
                ]);
            }

            $existingUsage = PenggunaanKendaraan::where(
                'reservasi_id',
                $reservation->id
            )->where(
                'status',
                UsageStatus::IN_PROGRESS
            )->first();

            if ($existingUsage) {
                throw ValidationException::withMessages([
                    'usage' => [
                        'Usage already started'
                    ]
                ]);
            }

            $usage = PenggunaanKendaraan::create([
                'reservasi_id' => $reservation->id,
                'odometer_awal' => $odometerAwal,
                'tanggal_berangkat' => now(),
                'status' => UsageStatus::IN_PROGRESS,
            ]);

            $reservation
                ->kendaraan
                ->update([
                    'status' => VehicleStatus::IN_USE
                ]);

            return $usage->fresh([
                'reservasi'
            ]);
        });
    }

    public function finish(
        PenggunaanKendaraan $usage,
        int $odometerAkhir,
        ?string $catatan
    ): PenggunaanKendaraan {

        return DB::transaction(function () use (
            $usage,
            $odometerAkhir,
            $catatan
        ) {

            $usage->refresh();

            if (
                $usage->status !== UsageStatus::IN_PROGRESS
            ) {
                throw ValidationException::withMessages([
                    'usage' => [
                        'Usage already completed'
                    ]
                ]);
            }

            if (
                $odometerAkhir <= $usage->odometer_awal
            ) {
                throw ValidationException::withMessages([
                    'odometer_akhir' => [
                        'Odometer akhir harus lebih besar'
                    ]
                ]);
            }

            $jarakTempuh =
                $odometerAkhir -
                $usage->odometer_awal;

            $usage->update([
                'odometer_akhir' => $odometerAkhir,
                'tanggal_kembali' => now(),
                'catatan' => $catatan,
                'jarak_tempuh' => $jarakTempuh,
                'status' => UsageStatus::COMPLETED,
            ]);

            $reservation = $usage->reservasi;

            $reservation->update([
                'status' => ReservationStatus::COMPLETED
            ]);

            $reservation
                ->kendaraan
                ->update([
                    'status' => VehicleStatus::AVAILABLE
                ]);

            return $usage->fresh([
                'reservasi'
            ]);
        });
    }
}
