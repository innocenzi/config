<?php

namespace @@namespace\Modules\ErrorReporting;

use Hybridly\Exceptions\HandleHybridExceptions;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Response;

use function Hybridly\view;

final class ConfigureExceptionHandler
{
    public function __invoke(Exceptions $exceptions): void
    {
        HandleHybridExceptions::register()
            ->renderUsing(fn (Response $response) => view('error-reporting::error', [
                'status' => $response->getStatusCode()
            ]))
            ->expireSessionUsing(fn () => back()->with([
                'error' => 'Your session has expired. Please refresh the page.',
            ]))
            ->__invoke($exceptions);
    }
}
