<?php

namespace App\Models;

use App\Enums\VehicleStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Kendaraan extends Model
{
    use HasUuids;

    protected $table = 'kendaraan';

    protected $fillable = [
        'kantor_id',
        'kode_kendaraan',
        'plat_nomor',
        'merk',
        'tipe',
        'tahun',
        'warna',
        'kapasitas_penumpang',
        'status',
    ];

    protected $casts = [
        'status' => VehicleStatus::class,
    ];
    public function kantor()
    {
        return $this->belongsTo(Kantor::class);
    }

    public function reservasi()
    {
        return $this->hasMany(
            ReservasiKendaraan::class
        );
    }

    public function service()
    {
        return $this->hasMany(
            JadwalService::class
        );
    }
}
