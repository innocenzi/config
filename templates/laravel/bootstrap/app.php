<?php

use Illuminate\Foundation\Application;
use @@namespace\Infrastructure\Http\ConfigureMiddleware;
use @@namespace\Modules\ErrorReporting\ConfigureExceptionHandler;

return Application::configure($basePath = dirname(__DIR__))
    ->withRouting()
    ->withMiddleware(new ConfigureMiddleware())
    ->withExceptions(new ConfigureExceptionHandler())
    ->create()
    ->useAppPath($basePath . '/src');
