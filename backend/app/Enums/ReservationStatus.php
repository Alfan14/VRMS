<?php

namespace App\Enums;

enum ReservationStatus:string
{
    case PENDING_LV1 = 'PENDING_LV1';
    case PENDING_LV2 = 'PENDING_LV2';
    case APPROVED = 'APPROVED';
    case REJECTED = 'REJECTED';
    case COMPLETED = 'COMPLETED';
    case CANCELLED = 'CANCELLED';

    public function label(): string
    {
        return str_replace('_', ' ', $this->value);
    }
}
