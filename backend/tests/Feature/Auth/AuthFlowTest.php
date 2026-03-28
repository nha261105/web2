<?php

namespace Tests\Feature\Auth;

use App\Models\Role;
use App\Models\User;
use App\Models\UserTokens;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthFlowTest extends TestCase
{
    use RefreshDatabase;

    private function createUser(array $attributes = []): User
    {
        return User::factory()->create(
            array_merge(
                [
                    'email' => 'auth.test@example.com',
                    'hash_password' => 'password123',
                    'full_name' => 'Auth Test',
                    'phone' => '0912345678',
                    'status' => 'ACTIVE',
                    'created_at' => now(),
                ],
                $attributes,
            ),
        );
    }

    public function test_sign_in_returns_422_with_standard_validation_payload(): void
    {
        $response = $this->postJson('/api/auth/sign-in', []);

        $response
            ->assertStatus(422)
            ->assertJson([
                'success' => false,
                'code' => 'VALIDATION_ERROR',
                'message' => 'Validation failed',
            ])
            ->assertJsonStructure([
                'errors' => ['email', 'password'],
            ]);
    }

    public function test_sign_in_returns_401_for_invalid_credentials(): void
    {
        $user = $this->createUser();

        $response = $this->postJson('/api/auth/sign-in', [
            'email' => $user->email,
            'password' => 'wrongpass123',
            'isRemember' => false,
        ]);

        $response->assertStatus(401)->assertJson([
            'success' => false,
            'code' => 'INVALID_CREDENTIALS',
        ]);
    }

    public function test_auth_flow_sign_in_me_check_token_and_sign_out(): void
    {
        $user = $this->createUser();

        $signInResponse = $this->postJson('/api/auth/sign-in', [
            'email' => $user->email,
            'password' => 'password123',
            'isRemember' => false,
        ]);

        $signInResponse->assertOk()->assertJson([
            'success' => true,
            'message' => 'Sign in successful',
        ]);

        $accessToken = $signInResponse->json('data.token.access_token');

        $this->assertNotNull($accessToken);

        $this->getJson('/api/auth/me', [
            'Authorization' => "Bearer {$accessToken}",
        ])
            ->assertOk()
            ->assertJson([
                'success' => true,
            ]);

        $this->postJson(
            '/api/user-tokens/check-token',
            [],
            [
                'Authorization' => "Bearer {$accessToken}",
            ],
        )
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Token is valid',
            ]);

        $this->postJson(
            '/api/auth/sign-out',
            [],
            [
                'Authorization' => "Bearer {$accessToken}",
            ],
        )
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Sign out successful',
            ]);

        $this->assertDatabaseMissing('user_tokens', [
            'token' => $accessToken,
        ]);

        $this->postJson(
            '/api/user-tokens/check-token',
            [],
            [
                'Authorization' => "Bearer {$accessToken}",
            ],
        )
            ->assertStatus(401)
            ->assertJson([
                'success' => false,
                'code' => 'UNAUTHORIZED',
            ]);
    }

    public function test_me_requires_bearer_token(): void
    {
        $this->getJson('/api/auth/me')
            ->assertStatus(401)
            ->assertJson([
                'success' => false,
                'code' => 'UNAUTHORIZED',
            ]);
    }

    public function test_roles_endpoint_returns_403_for_non_admin_user(): void
    {
        $user = $this->createUser([
            'email' => 'customer@example.com',
            'phone' => '0912345679',
        ]);

        $customerRole = Role::create(['name' => 'CUSTOMER']);
        $user->roles()->attach($customerRole->id);

        $token = UserTokens::create([
            'user_id' => $user->id,
            'token' => hash('sha256', 'customer-test-token'),
            'expires_at' => now()->addMinutes(30),
            'lastused_at' => now(),
        ]);

        $this->getJson('/api/roles', [
            'Authorization' => "Bearer {$token->token}",
        ])
            ->assertStatus(403)
            ->assertJson([
                'success' => false,
                'code' => 'FORBIDDEN',
            ]);
    }
}
