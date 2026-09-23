<?php

namespace App\Models;

use App\Enums\ApprovalStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Approval extends Model
{
     use HasUuids;

    protected $fillable = [
        'reservasi_id',
        'level',
        'approver_id',
        'status',
        'catatan',
        'approved_at',
    ];
    protected $casts = [
        'approved_at' => 'datetime',
        'status' => ApprovalStatus::class,
    ];
    public function reservasi()
    {
        return $this->belongsTo(
            ReservasiKendaraan::class,
            'reservasi_id'
        );
    }

    public function approver()
    {
        return $this->belongsTo(
            User::class,
            'approver_id'
        );
    }
}
