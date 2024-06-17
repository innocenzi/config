<?php

namespace @@namespace\Infrastructure;

use Illuminate\Support\AggregateServiceProvider;

/**
 * Registers the module service providers.
 */
final class ModulesServiceProvider extends AggregateServiceProvider
{
    protected $providers = [
        \@@namespace\Modules\ErrorReporting\ErrorReportingServiceProvider::class,
        \@@namespace\Modules\Authentication\AuthenticationServiceProvider::class,
        // ...
        \@@namespace\Modules\Homepage\HomepageServiceProvider::class,
    ];
}
