<?php

namespace Tests\Feature\Catalog;

use App\Models\Coupon;
use App\Models\Role;
use App\Models\User;
use App\Models\UserTokens;
use Tests\TestCase;

class CouponApiTest extends TestCase
{
    private string $token;
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'email' => 'coupon-admin@test.com',
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

    public function test_coupons_check_returns_not_found_for_invalid_code(): void
    {
        $payload = ['code' => 'INVALIDCODE123'];

        $response = $this->postJson('/api/coupons/check', $payload);

        $response->assertStatus(404);
    }

    public function test_coupons_check_returns_valid_coupon(): void
    {
        $coupon = Coupon::create([
            'code' => 'SUMMER2024',
            'discount_amount' => 50000,
            'valid_from' => now()->subDays(10),
            'valid_until' => now()->addDays(10),
        ]);

        $payload = ['code' => 'SUMMER2024'];

        $response = $this->postJson('/api/coupons/check', $payload);

        $response
            ->assertStatus(200)
            ->assertJsonStructure(['success', 'message', 'data']);
    }

    public function test_coupons_check_returns_not_found_for_expired_coupon(): void
    {
        $coupon = Coupon::create([
            'code' => 'EXPIRED2024',
            'discount_amount' => 50000,
            'valid_from' => now()->subDays(20),
            'valid_until' => now()->subDays(5),
        ]);

        $payload = ['code' => 'EXPIRED2024'];

        $response = $this->postJson('/api/coupons/check', $payload);

        $response->assertStatus(404);
    }

    public function test_coupons_store_validation_fails_with_duplicate_code(): void
    {
        $existingCoupon = Coupon::create([
            'code' => 'DUPLICATE123',
            'discount_amount' => 50000,
        ]);

        $payload = [
            'code' => 'DUPLICATE123',
            'discount_amount' => 75000,
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/coupons', $payload);

        $response
            ->assertStatus(422)
            ->assertJsonStructure(['success', 'message', 'code', 'errors']);
    }

    public function test_coupons_store_validation_fails_when_valid_until_before_valid_from(): void
    {
        $payload = [
            'code' => 'INVALID_DATE_123',
            'discount_amount' => 50000,
            'valid_from' => now()->addDays(10),
            'valid_until' => now()->addDays(5),
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/coupons', $payload);

        $response
            ->assertStatus(422)
            ->assertJsonStructure(['success', 'message', 'code', 'errors']);
    }
}
