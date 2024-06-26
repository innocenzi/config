<?php

namespace @@namespace\Infrastructure;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Foundation\Console\CliDumper;
use Illuminate\Foundation\Http\HtmlDumper;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;
use @@namespace\Modules\Authentication\User;

/**
 * Configures the framework.
 */
final class ConfigurationServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        HtmlDumper::dontIncludeSource();
        CliDumper::dontIncludeSource();
        Validator::excludeUnvalidatedArrayKeys();

        Model::shouldBeStrict();
        Model::unguard();

        Relation::enforceMorphMap([
            'user' => User::class,
        ]);

        Date::use(CarbonImmutable::class);
    }
}
