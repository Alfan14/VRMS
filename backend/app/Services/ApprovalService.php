<?php

namespace App\Services;

use App\Enums\ApprovalStatus;
use App\Enums\ReservationStatus;
use App\Enums\UserRole;
use App\Models\Approval;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApprovalService
{
    public function approve( Approval $approval, ?string $catatan = null): Approval {
        return DB::transaction(function () use (
            $approval,
            $catatan
        ) {
            $approval->refresh();

            if ($approval->status !== ApprovalStatus::PENDING) {
                throw ValidationException::withMessages([
                    'approval' => ['Approval already processed']
                ]);
            }

            $user = Auth::user();

            if (!$user) {
                abort(401, 'Unauthorized');
            }

            $this->validateApprovalRole(
                $approval,
                $user->role
            );

            $reservation = $approval->reservasi;

            if (
                $approval->level === 2 &&
                $reservation->status !== ReservationStatus::PENDING_LV2
            ) {
                throw ValidationException::withMessages([
                    'approval' => ['Level 1 approval required first']
                ]);
            }

            $approval->update([
                'approver_id' => $user->id,
                'status' => ApprovalStatus::APPROVED,
                'catatan' => $catatan,
                'approved_at' => now(),
            ]);

            if ($approval->level === 1) {
                $reservation->update([
                    'status' => ReservationStatus::PENDING_LV2
                ]);
            } else {
                $reservation->update([
                    'status' => ReservationStatus::APPROVED
                ]);
            }

            return $approval->fresh(['reservasi']);
        });
    }

    public function reject( Approval $approval, string $catatan): Approval {
        return DB::transaction(function () use (
            $approval,
            $catatan
        ) {
            $approval->refresh();

            if ($approval->status !== ApprovalStatus::PENDING) {
                throw ValidationException::withMessages([
                    'approval' => ['Approval already processed']
                ]);
            }

            $user = Auth::user();

            $this->validateApprovalRole(
                $approval,
                $user->role // Mengirim objek Enum UserRole
            );

            $approval->update([
                'approver_id' => $user->id,
                'status' => ApprovalStatus::REJECTED,
                'catatan' => $catatan,
                'approved_at' => now(),
            ]);

            $approval->reservasi->update([
                'status' => ReservationStatus::REJECTED
            ]);

            return $approval->fresh(['reservasi']);
        });
    }
    private function validateApprovalRole( Approval $approval, UserRole $role): void {
        if (
            $approval->level === 1 &&
            $role !== UserRole::KEPALA_OPERASIONAL
        ) {
            abort(403, 'Only Kepala Operasional can approve level 1');
        }
        if (
            $approval->level === 2 &&
            $role !== UserRole::MANAGER
        ) {
            abort(403, 'Only Manager can approve level 2');
        }
    }
}
