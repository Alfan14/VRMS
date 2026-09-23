<?php

namespace App\Enums;

enum ApprovalStatus:string
{
    case PENDING = 'PENDING';
    case APPROVED = 'APPROVED';
    case REJECTED = 'REJECTED';

    public function isFinal(): bool
    {
        return in_array(
            $this,
            [
                self::APPROVED,
                self::REJECTED
            ]
        );
    }
}
