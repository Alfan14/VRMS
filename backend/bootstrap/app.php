<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Schedule;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
        $middleware->api();
        $middleware->web();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
    // ->withSchedule(function (Schedule $schedule) {
    //     // Tambahkan di sini
    //     $schedule->command('xendit:check-unpaid-order')->hourly();
    // });
