<?php

namespace App\Models;

use App\Enums\ReservationStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ReservasiKendaraan extends Model
{
    use HasUuids;

    protected $table = 'reservasi_kendaraan';

    protected $fillable = [
        'nomor_reservasi',
        'kendaraan_id',
        'pengemudi_id',
        'pemohon_id',
        'tanggal_mulai',
        'tanggal_selesai',
        'tujuan',
        'keperluan',
        'status',
    ];

    protected $casts = [
        'tanggal_mulai' => 'datetime',
        'tanggal_selesai' => 'datetime',
        'status' => ReservationStatus::class,
    ];

    public function kendaraan()
    {
        return $this->belongsTo(Kendaraan::class);
    }

    public function pengemudi()
    {
        return $this->belongsTo(Pengemudi::class);
    }

    public function pemohon()
    {
        return $this->belongsTo(
            User::class,
            'pemohon_id'
        );
    }

    public function approvals()
    {
        return $this->hasMany(
            Approval::class,
            'reservasi_id'
        );
    }

    public function penggunaan()
    {
        return $this->hasOne(
            PenggunaanKendaraan::class,
            'reservasi_id'
        );
    }
}
