<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\FuelController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\VehicleUsageController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\KantorController;
use App\Http\Controllers\WilayahController;
use App\Http\Controllers\ReservationController;


Route::prefix('auth')->group(function () {
    Route::post('login',[AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('dashboard/summary',[DashboardController::class, 'summary']);
    Route::get( 'dashboard/recent-activities',[DashboardController::class, 'recentActivities']);
    Route::prefix('auth')->group(function () {
        Route::post('logout',[AuthController::class, 'logout']);
        Route::get('me',[AuthController::class, 'me']);
    });

    Route::get('vehicles',[VehicleController::class, 'index']);
    Route::get('vehicles/available',[VehicleController::class, 'available']);
    Route::get('vehicles/{vehicle}',[VehicleController::class, 'show']);

    Route::get('kantor',[KantorController::class, 'index']);
    Route::get('kantor/{kantor}',[KantorController::class, 'show']);
    Route::get('wilayah',[WilayahController::class, 'index']);
    Route::get('wilayah/{wilayah}',[WilayahController::class, 'show']);

    Route::get('drivers',[DriverController::class, 'index']);
    Route::get('drivers/{driver}',[DriverController::class, 'show']);
    Route::get('vehicle-usages',[VehicleUsageController::class, 'index']);
    Route::get('vehicle-usages/{usage}',[VehicleUsageController::class, 'show']);
    Route::get('fuel-records',[FuelController::class, 'index']);

    Route::get('drivers',[DriverController::class,'index']);
    Route::get('drivers/{driver}',[DriverController::class,'show']);

    Route::middleware('role:ADMIN')->group(function () {
        Route::apiResource('reservations',ReservationController::class)->only(['index','store','show','update','destroy']);
    });

    Route::middleware('role:ADMIN,KEPALA_OPERASIONAL')->group(function () {
        Route::post('vehicles',[VehicleController::class, 'store']);
        Route::put('vehicles/{vehicle}',[VehicleController::class, 'update']);
        Route::delete('vehicles/{vehicle}',[VehicleController::class, 'destroy']);

        Route::post('drivers',[DriverController::class,'store']);
        Route::put('drivers/{driver}',[DriverController::class,'update']);
        Route::delete('drivers/{driver}',[DriverController::class,'destroy']);

        Route::post('wilayah',[WilayahController::class, 'store']);
        Route::put('wilayah/{wilayah}',[WilayahController::class, 'update']);
        Route::delete('wilayah/{wilayah}',[WilayahController::class, 'destroy']);

        Route::post('kantor',[KantorController::class, 'store']);
        Route::put('kantor/{kantor}',[KantorController::class, 'update']);

        Route::delete('kantor/{kantor}',[KantorController::class, 'destroy']);
        Route::post('vehicle-usages/start',[VehicleUsageController::class, 'start']);
        Route::post('vehicle-usages/{usage}/finish',[VehicleUsageController::class, 'finish']);

        Route::get('fuel-records', [FuelController::class, 'index']);
        Route::get('fuel-records/{fuel}',[FuelController::class, 'show']);
        Route::post('fuel-records',[FuelController::class, 'store']);

        Route::get('services',[ServiceController::class, 'index']);
        Route::get('services/{service}',[ServiceController::class, 'show']);
        Route::post('services',[ServiceController::class, 'store']);
        Route::post('services/{service}/start',[ServiceController::class,'start']);
        Route::post('services/{service}/complete',[ServiceController::class, 'complete']);
    });

    Route::prefix('approvals')->group(function () {
        Route::get('pending-level-1',[ApprovalController::class, 'pendingLv1'])->middleware('role:KEPALA_OPERASIONAL');
        Route::get('pending-level-2',[ApprovalController::class, 'pendingLv2'])->middleware('role:MANAGER');
        Route::post('{approval}/approve',[ApprovalController::class, 'approve'])->middleware('role:KEPALA_OPERASIONAL,MANAGER');
        Route::post('{approval}/reject', [ApprovalController::class, 'reject'])->middleware('role:KEPALA_OPERASIONAL,MANAGER');
    });
});
