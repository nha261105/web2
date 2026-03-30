<?php

namespace Tests\Feature\Catalog;

use App\Models\Brand;
use App\Models\Role;
use App\Models\User;
use App\Models\UserTokens;
use Tests\TestCase;

class BrandApiTest extends TestCase
{
    private string $token;
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'email' => 'brand-admin@test.com',
        ]);
        $role = Role::firstOrCreate(['name' => 'ADMIN']);
        $this->admin->roles()->attach($role->id);

        $this->token = bin2hex(random_bytes(16));
        UserTokens::create([
            'user_id' => $this->admin->id,
            'token' => $this->token,
            'expires_at' => now()->addHours(2),
            'lastused_at' => now(),
        ]);
    }

    public function test_brands_index_returns_200(): void
    {
        $response = $this->getJson('/api/brands');

        $response
            ->assertStatus(200)
            ->assertJsonStructure(['success', 'message', 'data']);
    }

    public function test_brands_store_requires_authentication(): void
    {
        $payload = [
            'name' => 'Samsung',
            'logo' => 'https://example.com/samsung-logo.png',
        ];

        $response = $this->postJson('/api/brands', $payload);

        $response->assertStatus(401);
    }

    public function test_brands_store_validation_fails_with_missing_name(): void
    {
        $payload = [
            'logo' => 'https://example.com/logo.png',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/brands', $payload);

        $response
            ->assertStatus(422)
            ->assertJsonStructure(['success', 'message', 'code', 'errors']);
    }

    public function test_brands_store_successfully(): void
    {
        $payload = [
            'name' => 'LG Electronics',
            'logo' => 'https://example.com/lg-logo.png',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/brands', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('brands', [
            'name' => 'LG Electronics',
        ]);
    }

    public function test_brands_store_successfully_without_logo(): void
    {
        $payload = [
            'name' => 'Sony',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/brands', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('brands', [
            'name' => 'Sony',
        ]);
    }
}
