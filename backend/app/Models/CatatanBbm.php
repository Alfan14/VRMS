<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CatatanBbm extends Model
{
    use HasUuids;

    protected $table = 'catatan_bbm';

    protected $fillable = [
        'penggunaan_id',
        'tanggal',
        'liter',
        'harga_per_liter',
        'total_biaya',
        'spbu',
        'catatan',
    ];

    protected $casts = [
        'tanggal' => 'datetime',
        'liter' => 'decimal:2',
        'harga_per_liter' => 'decimal:2',
        'total_biaya' => 'decimal:2',
    ];

    public function penggunaan()
    {
        return $this->belongsTo(
            PenggunaanKendaraan::class,
            'penggunaan_id'
        );
    }
    public function getRouteKeyName(): string
    {
        return 'id';
    }
}
