<?php

namespace App\Http\Controllers;

use App\Models\Approval;
use App\Services\ApprovalService;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Approval\ApproveReservationRequest;
use App\Http\Requests\Approval\RejectReservationRequest;
use Illuminate\Support\Facades\Auth;

class ApprovalController extends Controller
{
    public function __construct(
        private ApprovalService $approvalService
    ) {}

    public function pendingLv1(): JsonResponse
    {
        $data = Approval::query()
            ->with([
                'reservasi',
                'reservasi.kendaraan',
                'reservasi.pengemudi',
                'reservasi.pemohon',
            ])
            ->where('level', 1)
            ->where('status', 'PENDING')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function pendingLv2(): JsonResponse
    {
        $data = Approval::query()
            ->with([
                'reservasi',
                'reservasi.kendaraan',
                'reservasi.pengemudi',
                'reservasi.pemohon',
            ])
            ->where('level', 2)
            ->where('status', 'PENDING')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function approve(
        ApproveReservationRequest $request,
        Approval $approval
    ): JsonResponse {

        $result = $this
            ->approvalService
            ->approve(
                $approval,
                $request->catatan
            );

        return response()->json([
            'success' => true,
            'message' => 'Approval successful',
            'data' => $result,
        ]);
    }

    public function reject(
        RejectReservationRequest $request,
        Approval $approval
    ): JsonResponse {

        $result = $this
            ->approvalService
            ->reject(
                $approval,
                $request->catatan
            );

        return response()->json([
            'success' => true,
            'message' => 'Reservation rejected',
            'data' => $result,
        ]);
    }
}
