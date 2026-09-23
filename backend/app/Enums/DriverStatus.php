<?php

namespace App\Enums;

enum DriverStatus:string
{
    case AVAILABLE = 'AVAILABLE';
    case ASSIGNED = 'ASSIGNED';
    case OFF = 'OFF';

    public function canAssign(): bool
    {
        return $this === self::AVAILABLE;
    }
}
