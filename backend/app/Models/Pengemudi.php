<?php

namespace App\Models;

use App\Enums\DriverStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Pengemudi extends Model
{
     use HasUuids;

    protected $table = 'pengemudi';

    protected $fillable = [
        'kantor_id',
        'nama',
        'no_hp',
        'sim_nomor',
        'sim_expired',
        'status',
    ];

    protected $casts = [
        'sim_expired' => 'date',
        'status' => DriverStatus::class,
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
}
