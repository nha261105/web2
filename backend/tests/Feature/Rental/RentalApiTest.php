<?php

namespace Tests\Feature\Rental;

use App\Models\Rental;
use App\Models\Role;
use App\Models\User;
use App\Models\UserTokens;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use App\Models\Address;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Support\Str;

class RentalApiTest extends TestCase
{
    use RefreshDatabase;

    private function createTokenFor(User $user): string
    {
        $token = bin2hex(random_bytes(16));

        UserTokens::create([
            'user_id' => $user->id,
            'token' => $token,
            'expires_at' => now()->addHours(2),
            'lastused_at' => now(),
        ]);

        return $token;
    }

    private function createAdminToken(): string
    {
        $admin = User::factory()->create();
        $adminRole = Role::firstOrCreate(['name' => 'ADMIN']);
        $admin->roles()->attach($adminRole->id);

        return $this->createTokenFor($admin);
    }

    public function test_rentals_index_requires_authentication(): void
    {
        $this->getJson('/api/rentals')->assertStatus(401);
    }

    public function test_rentals_index_returns_403_for_non_admin_user(): void
    {
        $user = User::factory()->create();
        $customerRole = Role::firstOrCreate(['name' => 'CUSTOMER']);
        $user->roles()->attach($customerRole->id);
        $token = $this->createTokenFor($user);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/rentals')
            ->assertStatus(403);
    }

    public function test_admin_can_get_rentals_index(): void
    {
        $adminToken = $this->createAdminToken();

        $customer = User::factory()->create();
        $addressId = DB::table('addresses')->insertGetId([
            'user_id' => $customer->id,
            'receive_name' => 'Receiver',
            'receive_phone' => '0911222333',
            'city' => 'HCM',
            'ward' => 'Ben Nghe',
            'street' => '1 Nguyen Hue',
            'is_default' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Rental::create([
            'user_id' => $customer->id,
            'address_id' => $addressId,
            'code' => 'RNT-001',
            'start_date' => now()->toDateTimeString(),
            'end_date' => now()->addDays(2)->toDateTimeString(),
            'total_price' => 200000,
            'deposit_amount' => 50000,
            'status' => 'PENDING',
        ]);

        $this->withHeader('Authorization', 'Bearer ' . $adminToken)
            ->getJson('/api/rentals')
            ->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['items', 'meta'],
            ]);
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