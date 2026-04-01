<?php

namespace Tests\Feature\Rental;

use App\Models\RentalPolicy;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RentalPolicyApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_rental_policies_index(): void
    {
        RentalPolicy::factory()->count(3)->create();

        $response = $this->getJson('/api/rental-policies');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => ['items' => [['id', 'late_day_fee', 'max_late_day']]],
        ]);
    }

    public function test_rental_policies_show(): void
    {
        $policy = RentalPolicy::factory()->create([
            'late_day_fee' => 50000,
            'max_late_day' => 30,
        ]);

        $response = $this->getJson("/api/rental-policies/{$policy->id}");

        $response->assertStatus(200);
        $response->assertJsonPath('data.policy.late_day_fee', 50000);
        $response->assertJsonPath('data.policy.max_late_day', 30);
    }

    public function test_rental_policies_store_without_auth(): void
    {
        $response = $this->postJson('/api/rental-policies', [
            'late_day_fee' => 50000,
            'max_late_day' => 30,
        ]);

        $response->assertStatus(401);
    }

    public function test_rental_policies_store_with_auth(): void
    {
        $admin = User::factory()->create();
        $adminRole = Role::firstOrCreate(['name' => 'ADMIN']);
        $admin->roles()->attach($adminRole->id);
        $token = $admin->tokens()->first()->token;

        $response = $this->postJson(
            '/api/rental-policies',
            [
                'late_day_fee' => 50000,
                'max_late_day' => 30,
            ],
            ['Authorization' => "Bearer {$token}"],
        );

        $response->assertStatus(201);
        $response->assertJsonPath('data.policy.late_day_fee', 50000);
        $response->assertDatabaseHas('rental_policies', [
            'late_day_fee' => 50000,
            'max_late_day' => 30,
        ]);
    }
}
