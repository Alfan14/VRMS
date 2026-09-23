<?php

namespace App\Enums;

enum ActivityModule:string
{
    case AUTH = 'AUTH';

    case RESERVATION = 'RESERVATION';
    case APPROVAL = 'APPROVAL';
    case VEHICLE = 'VEHICLE';
    case VEHICLE_USAGE = 'VEHICLE_USAGE';
    case DRIVER = 'DRIVER';
    case FUEL = 'FUEL';
    case SERVICE = 'SERVICE';
    case DASHBOARD = 'DASHBOARD';
}
