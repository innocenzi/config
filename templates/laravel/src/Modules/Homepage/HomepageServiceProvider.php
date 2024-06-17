<?php

namespace @@namespace\Modules\Homepage;

use @@namespace\Infrastructure\ServiceProvider;

final class HomepageServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->registerRoutes();
        $this->registerAsModule();
    }
}
