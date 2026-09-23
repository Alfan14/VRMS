<?php

namespace App\Enums;

enum VehicleUsageStatus:string
{
    case IN_PROGRESS = 'IN_PROGRESS';

    case COMPLETED = 'COMPLETED';

    case CANCELLED = 'CANCELLED';
}
