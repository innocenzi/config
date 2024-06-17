<?php

namespace @@namespace\Support\Concerns;

use Illuminate\Support\Facades\Validator;

trait ValidatesArguments
{
    protected function validate(array $arguments): array
    {
        return Validator::validate($arguments, $this->rules());
    }

    protected function rules(): array
    {
        return [];
    }
}
