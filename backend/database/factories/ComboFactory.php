<?php

namespace Database\Factories;

use App\Models\Combo;
use Illuminate\Database\Eloquent\Factories\Factory;

class ComboFactory extends Factory
{
    protected $model = Combo::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->word() . ' Combo',
            'daily_price' => $this->faker->numberBetween(1000, 50000),
            'description' => $this->faker->sentence(),
        ];
    }
}
