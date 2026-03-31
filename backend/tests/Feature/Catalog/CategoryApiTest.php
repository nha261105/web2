<?php

namespace Tests\Feature\Catalog;

use App\Models\Category;
use App\Models\Role;
use App\Models\User;
use App\Models\UserTokens;
use Tests\TestCase;

class CategoryApiTest extends TestCase
{
    private string $token;
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'email' => 'category-admin@test.com',
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

    public function test_categories_store_requires_authentication(): void
    {
        $payload = [
            'name' => 'Electronics',
            'slug' => 'electronics-' . uniqid(),
        ];

        $response = $this->postJson('/api/categories', $payload);

        $response->assertStatus(401);
    }

    public function test_categories_store_validation_fails_with_missing_fields(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/categories', []);

        $response
            ->assertStatus(422)
            ->assertJsonStructure(['success', 'message', 'code', 'errors']);
    }

    public function test_categories_store_validation_fails_with_duplicate_slug(): void
    {
        $existingCategory = Category::factory()->create();

        $payload = [
            'name' => 'New Electronics',
            'slug' => $existingCategory->slug,
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/categories', $payload);

        $response
            ->assertStatus(422)
            ->assertJsonStructure(['success', 'message', 'code', 'errors']);
    }
}
