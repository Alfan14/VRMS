<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Wilayah extends Model
{
    use HasUuids;

    protected $table = 'wilayah';

    protected $fillable = [
        'kode_wilayah',
        'nama_wilayah',
    ];

    public function kantor()
    {
        return $this->hasMany(Kantor::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
