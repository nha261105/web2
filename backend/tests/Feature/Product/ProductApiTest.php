<?php

namespace Tests\Feature\Product;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Role;
use App\Models\UserTokens;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;
use App\Models\User;

class ProductApiTest extends TestCase
{
    public function test_products_index_returns_200(): void
    {
        $response = $this->getJson('/api/products');

        $response
            ->assertStatus(200)
            ->assertJsonStructure(['success', 'message', 'data']);
    }
    public function test_products_store_requires_authentication(): void
    {
        $payload = ['name' => 'Test Product', 'price' => 1000];
        $res = $this->postJson('/api/products', $payload);
        $res->assertStatus(401);
    }
    public function test_products_store_validation_fails_when_missing_fields(): void
    {
        $admin = User::factory()->create(['email' => 'admin@example.com']);
        $role = Role::firstOrCreate(['name' => 'ADMIN']);
        $admin->roles()->attach($role->id);
        $token = bin2hex(random_bytes(16));
        UserTokens::create([
            'user_id' => $admin->id,
            'token' => $token,
            'expires_at' => now()->addHours(2),
            'lastused_at' => now(),
        ]);
        $res = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/products', []);
        $res->assertStatus(422)->assertJsonStructure([
            'success',
            'message',
            'code',
            'errors',
        ]);
    }
    public function test_products_store_successfully(): void
    {
        $admin = User::factory()->create(['email' => 'admintest@gmail.com']);
        $token = bin2hex(random_bytes(16));
        $role = Role::firstOrCreate(['name' => 'ADMIN']);
        $admin->roles()->attach($role->id);
        UserTokens::create([
            'user_id' => $admin->id,
            'token' => $token,
            'expires_at' => now()->addHours(2),
        ]);
        $category = Category::create([
            'name' => 'Điện thoại',
            'slug' => 'dien-thoai-' . uniqid(),
        ]);

        $brand = Brand::create([
            'name' => 'Apple',
            'slug' => 'apple-' . uniqid(),
        ]);

        $policy = null;
        if (Schema::hasTable('rental_policies')) {
            $policy = DB::table('rental_policies')->insertGetId([
                'late_day_fee' => 10.0,
                'max_late_day' => 5,
            ]);
        }
        $payload = [
            'name' => 'iphone15',
            'slug' => 'ip-15',
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'policies_id' => $policy,
            'deposit_price' => 5000,
            'daily_price' => 2000,
            'status' => 'ACTIVE',
            'description' => 'sản phẩm lỏ',
        ];
        $res = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/products', $payload);
        $res->assertStatus(201);
        $this->assertDatabaseHas('products', [
            'name' => 'iphone15',
            'slug' => $payload['slug'],
        ]);
    }
}
