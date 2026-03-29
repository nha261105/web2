<?php

namespace Database\Factories;

use App\Models\RentalPolicy;
use Illuminate\Database\Eloquent\Factories\Factory;

class RentalPolicyFactory extends Factory
{
    protected $model = RentalPolicy::class;

    public function definition(): array
    {
        return [
            'late_day_fee' => $this->faker->numberBetween(10000, 100000),
            'max_late_day' => $this->faker->numberBetween(30, 365),
        ];
    }
}
