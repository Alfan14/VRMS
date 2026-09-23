<?php

namespace App\Http\Controllers;

use App\Http\Requests\Reservation\UpdateReservationRequest;
use App\Models\ReservasiKendaraan;
use App\Services\ReservationService;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Reservation\StoreReservationRequest;

class ReservationController extends Controller
{
    public function __construct(
        private ReservationService $reservationService
    ) {}

    public function index(): JsonResponse
    {
        $reservations = ReservasiKendaraan::query()
            ->with([
                'kendaraan',
                'pengemudi',
                'pemohon',
                'approvals',
            ])
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $reservations,
        ]);
    }

    public function store(
        StoreReservationRequest $request
    ): JsonResponse {

        $reservation = $this->reservationService
            ->store($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Reservation created successfully',
            'data' => $reservation,
        ], 201);
    }

    public function show(
        ReservasiKendaraan $reservation
    ): JsonResponse {

        $reservation->load([
            'kendaraan',
            'pengemudi',
            'pemohon',
            'approvals',
        ]);

        return response()->json([
            'success' => true,
            'data' => $reservation,
        ]);
    }

    public function update( UpdateReservationRequest $request, ReservasiKendaraan $reservation): JsonResponse {
        $reservation->update(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Reservation updated successfully',
            'data' => $reservation->fresh([
                'kendaraan',
                'pengemudi',
                'approvals'
            ])
        ]);
    }

    public function destroy( ReservasiKendaraan $reservation): JsonResponse {
        $reservation->update([
            'status' => \App\Enums\ReservationStatus::CANCELLED
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reservation cancelled successfully'
        ]);
    }
}
