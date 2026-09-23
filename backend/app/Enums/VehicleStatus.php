<?php

namespace App\Enums;

enum VehicleStatus:string
{
    case AVAILABLE = 'AVAILABLE';
    case BOOKED = 'BOOKED';
    case IN_USE = 'IN_USE';
    case SERVICE = 'SERVICE';

    public function canReserve(): bool
    {
        return $this === self::AVAILABLE;
    }
}
