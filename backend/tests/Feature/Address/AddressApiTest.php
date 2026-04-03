<?php

namespace Tests\Feature\Address;

use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use App\Models\Address;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AddressApiTest extends TestCase
{
    use RefreshDatabase;

    // ─── Helpers ─────────────────────────────────────────────────────────────

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

    private function createAddress(int $userId, bool $isDefault = false): Address
    {
        return Address::create([
            'user_id'       => $userId,
            'receive_name'  => 'Nguyen Van A',
            'receive_phone' => '0901234567',
            'city'          => 'Ho Chi Minh',
            'ward'          => 'Phuong Ben Nghe',
            'street'        => '123 Nguyen Hue',
            'note'          => null,
            'is_default'    => $isDefault,
        ]);
    }

    private function validPayload(array $override = []): array
    {
        return array_merge([
            'receive_name'  => 'Nguyen Van B',
            'receive_phone' => '0909876543',
            'city'          => 'Ha Noi',
            'ward'          => 'Lang Ha',
            'street'        => '456 Lang Ha',
            'is_default'    => false,
        ], $override);
    }

    // ─── GET /api/users/me/addresses ─────────────────────────────────────────
    public function test_user_can_list_own_addresses(): void
    {
        [$user, $token] = $this->createUserWithToken();
        $this->createAddress($user->id);
        $this->createAddress($user->id);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/users/me/addresses');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(2, 'data.addresses');
    }

    public function test_list_addresses_fails_without_token_401(): void
    {
        $response = $this->getJson('/api/users/me/addresses');

        $response->assertStatus(401)
            ->assertJsonPath('code', 'UNAUTHORIZED');
    }

    // ─── POST /api/users/me/addresses ────────────────────────────────────────
    public function test_user_can_create_address(): void
    {
        [$user, $token] = $this->createUserWithToken();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/users/me/addresses', $this->validPayload());

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'address' => [
                        'id', 'receive_name', 'receive_phone',
                        'city', 'ward', 'street', 'is_default',
                    ],
                ],
            ]);
    }

    public function test_create_address_sets_default_correctly(): void
    {
        [$user, $token] = $this->createUserWithToken();
        $this->createAddress($user->id, true);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/users/me/addresses', $this->validPayload([
                'is_default' => true,
            ]));

        $response->assertStatus(201);

        $this->assertDatabaseMissing('addresses', [
            'user_id'    => $user->id,
            'street'     => '123 Nguyen Hue',
            'is_default' => true,
        ]);
    }

    public function test_create_address_fails_validation_422(): void
    {
        [$user, $token] = $this->createUserWithToken();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/users/me/addresses', [
                'receive_name'  => '',
                'receive_phone' => '090abc',
                'city'          => '',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'VALIDATION_ERROR')
            ->assertJsonStructure([
                'errors' => ['receive_name', 'receive_phone', 'city', 'ward', 'street'],
            ]);
    }

    public function test_create_address_fails_without_token_401(): void
    {
        $response = $this->postJson('/api/users/me/addresses', $this->validPayload());

        $response->assertStatus(401)
            ->assertJsonPath('code', 'UNAUTHORIZED');
    }

    // ─── PATCH /api/users/me/addresses/{id} ──────────────────────────────────
    public function test_user_can_update_own_address(): void
    {
        [$user, $token] = $this->createUserWithToken();
        $address        = $this->createAddress($user->id);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/users/me/addresses/{$address->id}", [
                'city' => 'Da Nang',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.address.city', 'Da Nang');
    }

    public function test_update_address_fails_invalid_phone_422(): void
    {
        [$user, $token] = $this->createUserWithToken();
        $address        = $this->createAddress($user->id);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/users/me/addresses/{$address->id}", [
                'receive_phone' => '090abc123',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'VALIDATION_ERROR');
    }

    public function test_update_address_of_other_user_returns_404(): void
    {
        [$user, $token] = $this->createUserWithToken();
        [$other]        = $this->createUserWithToken();
        $address        = $this->createAddress($other->id);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/users/me/addresses/{$address->id}", [
                'city' => 'Da Nang',
            ]);

        $response->assertStatus(404)
            ->assertJsonPath('code', 'NOT_FOUND');
    }

    public function test_update_address_fails_without_token_401(): void
    {
        [$user]  = $this->createUserWithToken();
        $address = $this->createAddress($user->id);

        $response = $this->patchJson("/api/users/me/addresses/{$address->id}", [
            'city' => 'Da Nang',
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('code', 'UNAUTHORIZED');
    }

    // ─── DELETE /api/users/me/addresses/{id} ─────────────────────────────────

    public function test_user_can_delete_own_address(): void
    {
        [$user, $token] = $this->createUserWithToken();
        $address        = $this->createAddress($user->id);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/users/me/addresses/{$address->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('addresses', ['id' => $address->id]);
    }

    public function test_delete_default_address_promotes_next(): void
    {
        [$user, $token] = $this->createUserWithToken();

        $default = $this->createAddress($user->id, true);
        $next    = $this->createAddress($user->id, false);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/users/me/addresses/{$default->id}");

        $this->assertDatabaseHas('addresses', [
            'id'         => $next->id,
            'is_default' => true,
        ]);
    }

    public function test_delete_address_fails_not_found_404(): void
    {
        [$user, $token] = $this->createUserWithToken();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson('/api/users/me/addresses/99999');

        $response->assertStatus(404)
            ->assertJsonPath('code', 'NOT_FOUND');
    }

    public function test_delete_address_of_other_user_returns_404(): void
    {
        [$user, $token] = $this->createUserWithToken();
        [$other]        = $this->createUserWithToken();
        $address        = $this->createAddress($other->id);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/users/me/addresses/{$address->id}");
        $response->assertStatus(404)
            ->assertJsonPath('code', 'NOT_FOUND');
    }

    public function test_delete_address_fails_without_token_401(): void
    {
        [$user]  = $this->createUserWithToken();
        $address = $this->createAddress($user->id);

        $response = $this->deleteJson("/api/users/me/addresses/{$address->id}");

        $response->assertStatus(401)
            ->assertJsonPath('code', 'UNAUTHORIZED');
    }

    // ─── Backward compat: Admin vẫn dùng /api/users/{userId}/addresses ───────
    public function test_admin_can_list_any_user_addresses_via_userId_route(): void
    {
        [$admin, $token] = $this->createUserWithToken('ADMIN');
        [$other]         = $this->createUserWithToken();
        $this->createAddress($other->id);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/users/{$other->id}/addresses");
        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }
}