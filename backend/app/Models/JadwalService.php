<?php

namespace App\Models;

use App\Enums\ServiceStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class JadwalService extends Model
{
    use HasUuids;
    protected $table = 'jadwal_service';
    protected $fillable = [
        'kendaraan_id',
        'tanggal_service',
        'jenis_service',
        'vendor',
        'biaya',
        'status',
        'keterangan',
    ];
    protected $casts = [
        'tanggal_service' => 'date',
        'status' => ServiceStatus::class,
    ];
    public function kendaraan()
    {
        return $this->belongsTo(
            Kendaraan::class
        );
    }
}
