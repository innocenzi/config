<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Foundation\Testing\TestCase;
use Illuminate\Support\Facades\Http;
use Tests\CreatesApplication;

uses(TestCase::class, CreatesApplication::class, LazilyRefreshDatabase::class)
    ->beforeEach(function () {
        Http::preventStrayRequests();
        $this->withoutVite();
    })
    ->in('../src');
