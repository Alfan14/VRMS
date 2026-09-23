<?php

namespace App\Enums;

enum UserRole:string
{
    case ADMIN = 'ADMIN';
    case KEPALA_OPERASIONAL = 'KEPALA_OPERASIONAL';
    case MANAGER = 'MANAGER';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Admin',
            self::KEPALA_OPERASIONAL => 'Kepala Operasional',
            self::MANAGER => 'Manager',
        };
    }
}
