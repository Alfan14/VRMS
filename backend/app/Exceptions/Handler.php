<?php

namespace App\Exceptions;

use Throwable;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Illuminate\Database\QueryException;

class Handler extends ExceptionHandler
{
    /**
     * Inputs that are never flashed for validation exceptions.
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     */
    public function report(Throwable $e): void
    {
        parent::report($e);
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        // Only format API responses
        if ($request->is('api/*')) {

            // 1. VALIDATION ERROR (422)
            if ($e instanceof ValidationException) {
                return response()->json([
                    'success' => false,
                    'type' => 'ValidationException',
                    'message' => 'Validation failed',
                    'errors' => $e->errors(),
                ], 422);
            }

            // 2. DATABASE ERROR
            if ($e instanceof QueryException) {
                return response()->json([
                    'success' => false,
                    'type' => 'DatabaseException',
                    'message' => $e->getMessage(),
                    'sql' => $e->getSql(),
                    'bindings' => $e->getBindings(),
                ], 500);
            }

            // 3. HTTP ERROR (404, 403, etc.)
            if ($e instanceof HttpExceptionInterface) {
                return response()->json([
                    'success' => false,
                    'type' => 'HttpException',
                    'message' => $e->getMessage() ?: 'HTTP Error',
                ], $e->getStatusCode());
            }

            // 4. GENERAL ERROR
            return response()->json([
                'success' => false,
                'type' => class_basename($e),
                'message' => $e->getMessage(),
                'debug' => app()->environment('local') ? [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null,
            ], 500);
        }

        return parent::render($request, $e);
    }
}
