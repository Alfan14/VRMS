<?php

namespace App\Enums;

enum ServiceStatus:string
{
    case SCHEDULED = 'SCHEDULED';
    case IN_PROGRESS = 'IN_PROGRESS';
    case COMPLETED = 'COMPLETED';


    public function isOpen(): bool
    {
        return in_array(
            $this,
            [
                self::SCHEDULED,
                self::IN_PROGRESS
            ]
        );
    }
}
