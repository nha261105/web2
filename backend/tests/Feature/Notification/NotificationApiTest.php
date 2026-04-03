<?php

namespace Tests\Feature\Notification;

use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Foundation\Testing\RefreshDatabase;

class NotificationApiTest extends TestCase
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

    private function createNotification(int $userId, bool $isRead = false): Notification
    {
        return Notification::create([
            'user_id'    => $userId,
            'title'      => 'Test Notification',
            'content'    => 'Test content',
            'type'       => 'ORDER',
            'is_read'    => $isRead,
            'created_at' => now(),
        ]);
    }

    // ─── GET /api/notifications ───────────────────────────────────────────────

    public function test_user_can_list_own_notifications(): void
    {
        [$user, $token] = $this->createUserWithToken();
        $this->createNotification($user->id);
        $this->createNotification($user->id, true);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/notifications');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data',
                'meta' => ['total', 'current_page', 'per_page', 'last_page', 'unread_count'],
            ]);
    }

    public function test_user_only_sees_own_notifications(): void
    {
        [$user, $token] = $this->createUserWithToken();
        [$other]        = $this->createUserWithToken();

        // Tạo notification cho other user
        $this->createNotification($other->id);
        // Tạo notification cho user đang login
        $this->createNotification($user->id);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/notifications');

        $response->assertStatus(200);
        // Chỉ thấy 1 notification của mình
        $this->assertCount(1, $response->json('data'));
    }

    public function test_unread_count_is_correct(): void
    {
        [$user, $token] = $this->createUserWithToken();
        $this->createNotification($user->id, false); // unread
        $this->createNotification($user->id, false); // unread
        $this->createNotification($user->id, true);  // read

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/notifications');

        $response->assertStatus(200)
            ->assertJsonPath('meta.unread_count', 2);
    }

    public function test_list_notifications_fails_without_token_401(): void
    {
        $response = $this->getJson('/api/notifications');

        $response->assertStatus(401)
            ->assertJsonPath('code', 'UNAUTHORIZED');
    }

    // ─── PATCH /api/notifications/{id}/read ──────────────────────────────────

    public function test_user_can_mark_notification_as_read(): void
    {
        [$user, $token] = $this->createUserWithToken();
        $notif = $this->createNotification($user->id, false);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/notifications/{$notif->id}/read");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('notifications', [
            'id'      => $notif->id,
            'is_read' => true,
        ]);
    }

    public function test_mark_as_read_fails_for_other_user_404(): void
    {
        [$user, $token] = $this->createUserWithToken();
        [$other]        = $this->createUserWithToken();
        $notif = $this->createNotification($other->id);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/notifications/{$notif->id}/read");

        // Service tìm theo user_id → không thấy → 404
        $response->assertStatus(404)
            ->assertJsonPath('code', 'NOT_FOUND');
    }

    public function test_mark_as_read_fails_without_token_401(): void
    {
        [$user] = $this->createUserWithToken();
        $notif  = $this->createNotification($user->id);

        $response = $this->patchJson("/api/notifications/{$notif->id}/read");

        $response->assertStatus(401)
            ->assertJsonPath('code', 'UNAUTHORIZED');
    }

    // ─── PATCH /api/notifications/read-all ───────────────────────────────────

    public function test_user_can_mark_all_notifications_as_read(): void
    {
        [$user, $token] = $this->createUserWithToken();
        $this->createNotification($user->id, false);
        $this->createNotification($user->id, false);
        $this->createNotification($user->id, false);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson('/api/notifications/read-all');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.updated_count', 3);

        // Verify DB
        $this->assertDatabaseMissing('notifications', [
            'user_id' => $user->id,
            'is_read' => false,
        ]);
    }

    public function test_mark_all_as_read_only_affects_own_notifications(): void
    {
        [$user, $token] = $this->createUserWithToken();
        [$other]        = $this->createUserWithToken();

        $this->createNotification($user->id,  false);
        $this->createNotification($other->id, false); // không bị ảnh hưởng

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson('/api/notifications/read-all');

        // Notification của other vẫn unread
        $this->assertDatabaseHas('notifications', [
            'user_id' => $other->id,
            'is_read' => false,
        ]);
    }

    public function test_mark_all_as_read_fails_without_token_401(): void
    {
        $response = $this->patchJson('/api/notifications/read-all');

        $response->assertStatus(401)
            ->assertJsonPath('code', 'UNAUTHORIZED');
    }
}