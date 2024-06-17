<?php

namespace @@namespace\Modules\ErrorReporting;

use @@namespace\Infrastructure\ServiceProvider;

final class ErrorReportingServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->registerViews();
    }
}
