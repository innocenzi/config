<?php

namespace @@namespace\Modules\Authentication;

use @@namespace\Infrastructure\ServiceProvider;

final class AuthenticationServiceProvider extends ServiceProvider
{
    public const INDEX = 'index';

    public function register(): void
    {
        $this->registerRoutes(middleware: 'web');
    }
}
