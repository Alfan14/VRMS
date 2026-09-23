<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Enums\UserRole;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

    protected $fillable = [
        'username',
        'password',
        'role',
        "pin"
    ];
    protected $hidden = [
        'password',
        'pin'
    ];

    protected $casts = [
        'role' => UserRole::class,
    ];

    public function getAuthPassword()
    {
        return $this->password;
    }

    public function wilayah()
    {
        return $this->belongsTo(Wilayah::class);
    }

    public function kantor()
    {
        return $this->belongsTo(Kantor::class);
    }

    public function reservasi()
    {
        return $this->hasMany(
            ReservasiKendaraan::class,
            'pemohon_id'
        );
    }

    public function approvals()
    {
        return $this->hasMany(
            Approval::class,
            'approver_id'
        );
    }
    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }
}
