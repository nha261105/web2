<?php

namespace Tests\Feature\User;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_users()
    {
        $admin = User::factory()->create(['status' => 'ACTIVE']);
        $admin->roles()->create(['name' => 'ADMIN']);

        $token = \Illuminate\Support\Str::random(60);
        $admin->tokens()->create([
            'token' => $token,
            'expires_at' => now()->addDays(30),
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'data',
                    'meta'
                ]
            ]);
    }

    public function test_user_can_get_own_profile()
    {
        $user = User::factory()->create(['status' => 'ACTIVE']);

        $token = \Illuminate\Support\Str::random(60);

        $user->tokens()->create([
            'token' => $token,
            'expires_at' => now()->addDays(30),
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/users/me');

        $response->assertStatus(200)
            ->assertJsonPath('data.user.email', $user->email);
    }
}
