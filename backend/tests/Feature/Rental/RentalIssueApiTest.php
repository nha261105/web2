<?php

namespace Tests\Feature\Rental;

use App\Models\Role;
use App\Models\User;
use App\Models\UserTokens;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RentalIssueApiTest extends TestCase
{
    use RefreshDatabase;

    private function createAdminToken(): string
    {
        $admin = User::factory()->create();
        $adminRole = Role::firstOrCreate(['name' => 'ADMIN']);
        $admin->roles()->attach($adminRole->id);

        $token = bin2hex(random_bytes(16));

        UserTokens::create([
            'user_id' => $admin->id,
            'token' => $token,
            'expires_at' => now()->addHours(2),
            'lastused_at' => now(),
        ]);

        return $token;
    }

    public function test_rental_issue_store_requires_authentication(): void
    {
        $this->postJson('/api/rental-issues', [])->assertStatus(401);
    }

    public function test_rental_issue_store_validates_required_fields(): void
    {
        $token = $this->createAdminToken();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/rental-issues', [])
            ->assertStatus(422)
            ->assertJsonStructure(['success', 'message', 'code', 'errors']);
    }

    public function test_rental_issue_update_returns_404_for_missing_issue(): void
    {
        $token = $this->createAdminToken();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson('/api/rental-issues/999999', [
                'status' => 'RESOLVED',
            ])
            ->assertStatus(404);
    }
}
