<?php

namespace @@namespace\Infrastructure;

use Hybridly\Hybridly;
use Illuminate\Contracts\Foundation\CachesConfiguration;
use Illuminate\Contracts\Foundation\CachesRoutes;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;

abstract class ServiceProvider extends BaseServiceProvider
{
    public static function getNamespace(): string
    {
        return str(static::class)
            ->classBasename()
            ->before('ServiceProvider')
            ->kebab();
    }

    protected function registerAsModule(): void
    {
        $hybridly = $this->app->make(Hybridly::class);

        $trace = debug_backtrace(
            options: \DEBUG_BACKTRACE_IGNORE_ARGS,
            limit: 1,
        );

        $hybridly->loadModuleFrom(dirname($trace[0]['file']), static::getNamespace());
    }

    protected function registerViews(): void
    {
        $hybridly = $this->app->make(Hybridly::class);

        $trace = debug_backtrace(
            options: \DEBUG_BACKTRACE_IGNORE_ARGS,
            limit: 1,
        );

        $hybridly->loadViewsFrom(dirname($trace[0]['file']), static::getNamespace());
    }

    protected function registerRoutes(string|array $middleware = []): void
    {
        if ($this->app instanceof CachesRoutes && $this->app->routesAreCached()) {
            return;
        }

        $trace = debug_backtrace(
            options: \DEBUG_BACKTRACE_IGNORE_ARGS,
            limit: 1,
        );

        /** @var Router */
        $router = $this->app->make('router');
        $router
            ->middleware($middleware)
            ->name(static::getNamespace() . '.')
            ->group(\dirname($trace[0]['file']) . '/routes.php');
    }

    /**
     * Registers the `config.php` file in the same directory as the caller.
     */
    protected function registerConfig(?string $key = null, ?string $file = null): void
    {
        if ($this->app instanceof CachesConfiguration && $this->app->configurationIsCached()) {
            return;
        }

        $trace = debug_backtrace(
            options: \DEBUG_BACKTRACE_IGNORE_ARGS,
            limit: 1,
        );

        $config = $this->app->make('config');
        $key ??= static::getNamespace();

        $config->set($key, array_merge(
            $config->get($key, default: []),
            require \dirname($trace[0]['file']) . '/'. ($file ?? 'config') . '.php',
        ));
    }
}
