<?php

namespace Tests\Feature\User;

use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserApiTest extends TestCase
{
    use RefreshDatabase;

    // ─── Helpers ─────────────────────────────────────────────────────────────

    /**
     * Tạo user với token hợp lệ, tuỳ chọn gán role.
     */
    private function createUserWithToken(string $role = null): array
    {
        $user = User::factory()->create(['status' => 'ACTIVE']);

        if ($role) {
            $roleModel = Role::firstOrCreate(['name' => $role]);
            $user->roles()->attach($roleModel->id);
        }

        $token = \Illuminate\Support\Str::random(60);
        $user->tokens()->create([
            'token'      => $token,
            'expires_at' => now()->addDays(30),
        ]);

        return [$user, $token];
    }

    // ─── POST /api/users ─────────────────────────────────────────────────────

    public function test_anyone_can_create_user(): void
    {
        $response = $this->postJson('/api/users', [
            'email'     => 'newuser@example.com',
            'password'  => 'password123',
            'full_name' => 'New User',
            'phone'     => '0901234567',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['user' => ['id', 'email', 'full_name']]]);
    }

    public function test_create_user_fails_validation_422(): void
    {
        $response = $this->postJson('/api/users', [
            'email'    => 'not-an-email',
            'password' => '123',
            'phone'    => '090',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'VALIDATION_ERROR')
            ->assertJsonStructure(['errors' => ['email', 'password', 'full_name', 'phone']]);
    }

    public function test_create_user_fails_duplicate_email_422(): void
    {
        User::factory()->create(['email' => 'exists@example.com']);

        $response = $this->postJson('/api/users', [
            'email'     => 'exists@example.com',
            'password'  => 'password123',
            'full_name' => 'Another User',
            'phone'     => '0901234568',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    // ─── GET /api/users/me ────────────────────────────────────────────────────

    public function test_user_can_get_own_profile(): void
    {
        [$user, $token] = $this->createUserWithToken();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/users/me');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.email', $user->email)
            ->assertJsonPath('data.user.full_name', $user->full_name);
    }

    public function test_get_me_fails_without_token_401(): void
    {
        $response = $this->getJson('/api/users/me');

        $response->assertStatus(401)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'UNAUTHORIZED');
    }

    public function test_get_me_fails_with_invalid_token_401(): void
    {
        $response = $this->withHeader('Authorization', 'Bearer invalid_token_xyz')
            ->getJson('/api/users/me');

        $response->assertStatus(401)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'UNAUTHORIZED');
    }

    // ─── PATCH /api/users/me ──────────────────────────────────────────────────

    public function test_user_can_update_own_profile(): void
    {
        [$user, $token] = $this->createUserWithToken();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson('/api/users/me', [
                'full_name' => 'Updated Name',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.full_name', 'Updated Name');
    }

    public function test_update_me_fails_duplicate_phone_422(): void
    {
        User::factory()->create(['phone' => '0909999999']);
        [$user, $token] = $this->createUserWithToken();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson('/api/users/me', [
                'phone' => '0909999999',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'VALIDATION_ERROR');
    }

    public function test_update_me_fails_without_token_401(): void
    {
        $response = $this->patchJson('/api/users/me', ['full_name' => 'X']);

        $response->assertStatus(401)
            ->assertJsonPath('code', 'UNAUTHORIZED');
    }

    // ─── GET /api/users (Admin only) ─────────────────────────────────────────

    public function test_admin_can_list_users(): void
    {
        [$admin, $token] = $this->createUserWithToken('ADMIN');
        User::factory()->count(3)->create();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'data',
                    'meta' => ['total', 'current_page', 'per_page', 'last_page'],
                ],
            ]);
    }

    public function test_list_users_fails_for_non_admin_403(): void
    {
        [$user, $token] = $this->createUserWithToken('CUSTOMER');

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/users');

        $response->assertStatus(403)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'FORBIDDEN');
    }

    public function test_list_users_fails_without_token_401(): void
    {
        $response = $this->getJson('/api/users');

        $response->assertStatus(401)
            ->assertJsonPath('code', 'UNAUTHORIZED');
    }

    // ─── GET /api/users/{id} (Admin only) ────────────────────────────────────

    public function test_admin_can_get_user_by_id(): void
    {
        [$admin, $token] = $this->createUserWithToken('ADMIN');
        $target = User::factory()->create();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/users/{$target->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.id', $target->id);
    }

    public function test_get_user_by_id_fails_not_found_404(): void
    {
        [$admin, $token] = $this->createUserWithToken('ADMIN');

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/users/99999');

        $response->assertStatus(404)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'NOT_FOUND');
    }

    public function test_get_user_by_id_fails_for_non_admin_403(): void
    {
        [$user, $token] = $this->createUserWithToken('CUSTOMER');
        $target = User::factory()->create();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/users/{$target->id}");

        $response->assertStatus(403)
            ->assertJsonPath('code', 'FORBIDDEN');
    }

    // ─── PATCH /api/users/{id}/status (Admin only) ───────────────────────────

    public function test_admin_can_update_user_status(): void
    {
        [$admin, $token] = $this->createUserWithToken('ADMIN');
        $target = User::factory()->create(['status' => 'ACTIVE']);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/users/{$target->id}/status", [
                'status' => 'INACTIVE',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.status', 'INACTIVE');
    }

    public function test_update_status_fails_invalid_value_422(): void
    {
        [$admin, $token] = $this->createUserWithToken('ADMIN');
        $target = User::factory()->create();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/users/{$target->id}/status", [
                'status' => 'BANNED',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'VALIDATION_ERROR');
    }

    public function test_update_status_fails_for_non_admin_403(): void
    {
        [$user, $token] = $this->createUserWithToken('CUSTOMER');
        $target = User::factory()->create();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/users/{$target->id}/status", [
                'status' => 'INACTIVE',
            ]);

        $response->assertStatus(403)
            ->assertJsonPath('code', 'FORBIDDEN');
    }

    // ─── DELETE /api/users/{id} (Admin only) ─────────────────────────────────

    public function test_admin_can_delete_user(): void
    {
        [$admin, $token] = $this->createUserWithToken('ADMIN');
        $target = User::factory()->create();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/users/{$target->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertSoftDeleted('users', ['id' => $target->id]);
    }

    public function test_delete_user_fails_not_found_404(): void
    {
        [$admin, $token] = $this->createUserWithToken('ADMIN');

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson('/api/users/99999');

        $response->assertStatus(404)
            ->assertJsonPath('code', 'NOT_FOUND');
    }

    public function test_delete_user_fails_for_non_admin_403(): void
    {
        [$user, $token] = $this->createUserWithToken('CUSTOMER');
        $target = User::factory()->create();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/users/{$target->id}");

        $response->assertStatus(403)
            ->assertJsonPath('code', 'FORBIDDEN');
    }

    public function test_delete_user_fails_without_token_401(): void
    {
        $target = User::factory()->create();

        $response = $this->deleteJson("/api/users/{$target->id}");

        $response->assertStatus(401)
            ->assertJsonPath('code', 'UNAUTHORIZED');
    }
}