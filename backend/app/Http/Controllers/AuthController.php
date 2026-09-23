<?php

namespace App\Http\Controllers;

use App\Enums\ActivityAction;
use App\Enums\ActivityModule;
use App\Services\AuthService;
use Illuminate\Http\Request;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\ActivityLogService;

class AuthController extends Controller
{

    public function __construct(
        private AuthService $authService,
        private ActivityLogService $activityLogService
    ) {}

    public function login(
        LoginRequest $request
    ) {

        $result = $this->authService->login(
            $request->username,
            $request->password
        );

        $this->activityLogService->log(
            ActivityModule::AUTH,
            ActivityAction::LOGIN,
            $result['user']->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => $result
        ]);
    }

    public function logout(
        Request $request
    ) {

        $this->activityLogService->log(
            ActivityModule::AUTH,
            ActivityAction::LOGOUT,
            $request->user()->id
        );

        $request
            ->user()
            ->currentAccessToken()
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout successful'
        ]);
    }

    public function me(
        Request $request
    ) {

        return response()->json([
            'success' => true,
            'data' => $request->user()
        ]);
    }
}
