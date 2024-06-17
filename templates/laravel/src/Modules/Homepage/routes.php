<?php

namespace @@namespace\Modules\Homepage;

use Illuminate\Support\Facades\Route;

use function Hybridly\view;

Route::get('/', fn () => view('homepage::index'))->name('index');
