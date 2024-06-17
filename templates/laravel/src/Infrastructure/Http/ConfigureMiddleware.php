<?php

namespace @@namespace\Infrastructure\Http;

use Illuminate\Foundation\Configuration\Middleware;

/**
 * Configures the middleware stack.
 */
final class ConfigureMiddleware
{
    public function __invoke(Middleware $middleware): void
    {
        $middleware->appendToGroup('web', HandleHybridRequests::class);
    }
}
