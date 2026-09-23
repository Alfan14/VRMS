<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Kantor extends Model
{
     use HasUuids;

    protected $table = 'kantor';

    protected $fillable = [
        'wilayah_id',
        'kode_kantor',
        'nama_kantor',
        'alamat',
    ];

    public function wilayah()
    {
        return $this->belongsTo(Wilayah::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function kendaraan()
    {
        return $this->hasMany(Kendaraan::class);
    }

    public function pengemudi()
    {
        return $this->hasMany(Pengemudi::class);
    }
}
