<?php

namespace App\Services;

use App\Enums\ActivityAction;
use App\Enums\ActivityModule;
use App\Enums\ApprovalStatus;
use App\Enums\ReservationStatus;
use App\Enums\VehicleStatus;
use App\Models\Approval;
use App\Models\Kendaraan;
use App\Models\Pengemudi;
use App\Models\ReservasiKendaraan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReservationService
{
    public function __construct(
        private ActivityLogService $activityLogService
    ) {}

    public function store(array $data): ReservasiKendaraan
    {
        return DB::transaction(function () use ($data) {

            $this->validateVehicleAvailability(
                $data['kendaraan_id'],
                $data['tanggal_mulai'],
                $data['tanggal_selesai']
            );

            $this->validateDriverAvailability(
                $data['pengemudi_id'],
                $data['tanggal_mulai'],
                $data['tanggal_selesai']
            );

            $reservation = ReservasiKendaraan::create([
                'nomor_reservasi' => $this->generateReservationNumber(),
                'kendaraan_id' => $data['kendaraan_id'],
                'pengemudi_id' => $data['pengemudi_id'],
                'pemohon_id' => Auth::id(),
                'tanggal_mulai' => $data['tanggal_mulai'],
                'tanggal_selesai' => $data['tanggal_selesai'],
                'tujuan' => $data['tujuan'],
                'keperluan' => $data['keperluan'],
                'status' => ReservationStatus::PENDING_LV1,
            ]);

            Approval::create([
                'reservasi_id' => $reservation->id,
                'level' => 1,
                'status' => ApprovalStatus::PENDING,
            ]);

            Approval::create([
                'reservasi_id' => $reservation->id,
                'level' => 2,
                'status' => ApprovalStatus::PENDING,
            ]);

            $this->activityLogService->log(
                ActivityModule::RESERVATION,
                ActivityAction::CREATE,
                $reservation->id,
                null,
                $reservation->toArray()
            );

            return $reservation->load([
                'kendaraan',
                'pengemudi',
                'approvals',
            ]);
        });
    }

    private function validateVehicleAvailability(
        string $kendaraanId,
        string $tanggalMulai,
        string $tanggalSelesai
    ): void {

        $vehicle = Kendaraan::findOrFail($kendaraanId);

        if (
            $vehicle->status === VehicleStatus::SERVICE
        ) {
            throw ValidationException::withMessages([
                'kendaraan_id' => [
                    'Vehicle currently under service'
                ]
            ]);
        }

        if (
            $vehicle->status !== VehicleStatus::AVAILABLE
        ) {
            throw ValidationException::withMessages([
                'kendaraan_id' => [
                    'Vehicle is not available'
                ]
            ]);
        }

        $overlap = ReservasiKendaraan::query()
            ->where('kendaraan_id', $kendaraanId)
            ->whereNotIn('status', [
                'REJECTED',
                'CANCELLED',
            ])
            ->where(function ($query) use (
                $tanggalMulai,
                $tanggalSelesai
            ) {
                $query
                    ->where('tanggal_mulai', '<=', $tanggalSelesai)
                    ->where('tanggal_selesai', '>=', $tanggalMulai);
            })
            ->exists();

        if ($overlap) {
            throw ValidationException::withMessages([
                'kendaraan_id' => [
                    'Vehicle already reserved for selected schedule'
                ]
            ]);
        }
    }

    private function validateDriverAvailability(
        string $pengemudiId,
        string $tanggalMulai,
        string $tanggalSelesai
    ): void {

        $driver = Pengemudi::findOrFail($pengemudiId);

        if (
            property_exists($driver, 'status') &&
            $driver->status !== 'AVAILABLE'
        ) {
            throw ValidationException::withMessages([
                'pengemudi_id' => [
                    'Driver is not available'
                ]
            ]);
        }

        $overlap = ReservasiKendaraan::query()
            ->where('pengemudi_id', $pengemudiId)
            ->whereNotIn('status', [
                'REJECTED',
                'CANCELLED',
            ])
            ->where(function ($query) use (
                $tanggalMulai,
                $tanggalSelesai
            ) {
                $query
                    ->where('tanggal_mulai', '<=', $tanggalSelesai)
                    ->where('tanggal_selesai', '>=', $tanggalMulai);
            })
            ->exists();

        if ($overlap) {
            throw ValidationException::withMessages([
                'pengemudi_id' => [
                    'Driver already assigned for selected schedule'
                ]
            ]);
        }
    }

    private function generateReservationNumber(): string
    {
        $date = now()->format('Ymd');

        $lastReservation = ReservasiKendaraan::query()
            ->whereDate('created_at', today())
            ->latest()
            ->first();

        $sequence = 1;

        if ($lastReservation) {
            $lastNumber = explode(
                '-',
                $lastReservation->nomor_reservasi
            );

            $sequence = ((int) end($lastNumber)) + 1;
        }

        return sprintf(
            'RSV-%s-%04d',
            $date,
            $sequence
        );
    }
}
