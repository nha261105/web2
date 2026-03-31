<?php

namespace Tests\Feature\Rental;

use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use App\Models\Rental;
use App\Models\Address;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Support\Str;

class RentalApiTest extends TestCase
{
    use RefreshDatabase;

    private function createUserWithToken(string $role = null): array
    {
        $user = User::factory()->create(['status' => 'ACTIVE']);

        if ($role) {
            $roleModel = Role::firstOrCreate(['name' => $role]);
            $user->roles()->attach($roleModel->id);
        }

        $token = Str::random(60);
        $user->tokens()->create([
            'token'      => $token,
            'expires_at' => now()->addDays(30),
        ]);

        return [$user, $token];
    }

    #[Test]
    public function user_can_only_see_their_own_rentals(): void
    {
        // 1. Tạo 2 user có token hợp lệ
        [$user1, $token1] = $this->createUserWithToken('CUSTOMER');
        [$user2, $token2] = $this->createUserWithToken('CUSTOMER');

        // 2. Tạo Address (Dùng đúng cấu trúc bảng bạn gửi)
        $address = Address::create([
            'user_id' => $user1->id,
            'receive_name' => 'Bảo Nguyễn',
            'receive_phone' => '0901000003',
            'city' => 'TP. Hồ Chí Minh',
            'district' => 'Quận 1',
            'ward' => 'Phường Bến Nghé',
            'street' => '12 Lê Lợi',
            'is_default' => 1
        ]);

        // 3. Tạo đơn hàng cho User 1
        Rental::factory()->create([
            'user_id' => $user1->id,
            'address_id' => $address->id,
            'code' => 'ORDER-001'
        ]);

        // 4. Tạo đơn hàng cho User 2
        Rental::factory()->create([
            'user_id' => $user2->id,
            'address_id' => $address->id,
            'code' => 'ORDER-002'
        ]);

        // 5. Gọi API với Token của User 1
        $response = $this->withHeader('Authorization', 'Bearer ' . $token1)
            ->getJson('/api/rentals');

        // 6. Assert: Chỉ được thấy 1 đơn của chính mình
        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data.items')
            ->assertJsonPath('data.items.0.code', 'ORDER-001');
    }

    #[Test]
    public function guest_cannot_access_rentals(): void
    {
        $response = $this->getJson('/api/rentals');

        $response->assertStatus(401)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'UNAUTHORIZED');
    }
}