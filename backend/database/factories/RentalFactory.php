<?php

namespace Database\Factories;

use App\Models\Rental;
use App\Models\User;
use App\Models\Address;
use Illuminate\Database\Eloquent\Factories\Factory;

class RentalFactory extends Factory
{
    protected $model = Rental::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'address_id' => \App\Models\Address::factory(),
            'code' => 'RENT-' . $this->faker->unique()->numerify('#####'),
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addDays(3)->format('Y-m-d'),
            'total_price' => $this->faker->numberBetween(100, 1000),
            'deposit_amount' => 50,
            'status' => 'PENDING',
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
