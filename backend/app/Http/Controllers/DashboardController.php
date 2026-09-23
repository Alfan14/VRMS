<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Services\DashboardService;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    public function summary(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this
                ->dashboardService
                ->summary(),
        ]);
    }

    public function recentActivities(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this
                ->dashboardService
                ->recentActivities(),
        ]);
    }
}
