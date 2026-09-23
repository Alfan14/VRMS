<?php

namespace App\Models;

use App\Enums\UsageStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Enums\VehicleUsageStatus;

class PenggunaanKendaraan extends Model
{
    use HasUuids;

    protected $table = 'penggunaan_kendaraan';

    protected $fillable = [
        'reservasi_id',
        'odometer_awal',
        'odometer_akhir',
        'tanggal_berangkat',
        'tanggal_kembali',
        'catatan',
        'status',
        'jarak_tempuh',
    ];

    protected $casts = [
        'tanggal_berangkat' => 'datetime',
        'tanggal_kembali' => 'datetime',
        'status' => UsageStatus::class,
    ];
    public function reservasi()
    {
        return $this->belongsTo(
            ReservasiKendaraan::class,
            'reservasi_id'
        );
    }

    public function bbm()
    {
        return $this->hasMany(
            CatatanBbm::class,
            'penggunaan_id'
        );
    }

    public function getRouteKeyName(): string
    {
        return 'id';
    }
}
