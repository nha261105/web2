<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'hash_password' => 'password123',
            'full_name' => fake()->name(),
            'phone' => fake()->unique()->numerify('0#########'),
            'status' => 'ACTIVE',
            'created_at' => now(),
        ];
    }
}
