<?php

namespace App\Enums;

enum ActivityAction:string
{
    case CREATE = 'CREATE';
    case UPDATE = 'UPDATE';
    case DELETE = 'DELETE';
    case LOGIN = 'LOGIN';
    case LOGOUT = 'LOGOUT';
    case APPROVE = 'APPROVE';
    case REJECT = 'REJECT';
    case EXPORT = 'EXPORT';
    case START = 'START';
    case FINISH = 'FINISH';
}
