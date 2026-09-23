<?php

namespace App\Services;

use App\Enums\ActivityAction;
use App\Enums\ActivityModule;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class ActivityLogService
{
    public function log(
        ActivityModule $module,
        ActivityAction $action,
        ?string $referenceId = null,
        ?array $oldData = null,
        ?array $newData = null
    ): void {

        ActivityLog::create([
            'user_id' => Auth::id(),
            'module' => $module->value,
            'action' => $action->value,
            'reference_id' => $referenceId,
            'old_data' => $oldData,
            'new_data' => $newData,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
