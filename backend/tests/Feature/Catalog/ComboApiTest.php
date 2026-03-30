<?php

namespace Tests\Feature\Catalog;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Combo;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use App\Models\UserTokens;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ComboApiTest extends TestCase
{
    private string $token;
    private User $admin;
    private Product $product1;
    private Product $product2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'email' => 'combo-admin@test.com',
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

        $category = Category::factory()->create();
        $brand = Brand::factory()->create();

        $policyId = null;
        if (Schema::hasTable('rental_policies')) {
            $policyId = DB::table('rental_policies')->insertGetId([
                'late_day_fee' => 10.0,
                'max_late_day' => 5,
            ]);
        }

        $this->product1 = Product::create([
            'name' => 'Product 1 for Combo',
            'slug' => 'product-1-combo-' . uniqid(),
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'policies_id' => $policyId,
            'deposit_price' => 5000,
            'daily_price' => 1000,
            'status' => 'ACTIVE',
            'description' => 'Product 1 Description',
        ]);

        $this->product2 = Product::create([
            'name' => 'Product 2 for Combo',
            'slug' => 'product-2-combo-' . uniqid(),
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'policies_id' => $policyId,
            'deposit_price' => 3000,
            'daily_price' => 500,
            'status' => 'ACTIVE',
            'description' => 'Product 2 Description',
        ]);
    }

    public function test_combos_store_requires_authentication(): void
    {
        $payload = [
            'name' => 'Test Combo',
            'daily_price' => 2000,
            'description' => 'A test combo',
            'items' => [['product_id' => $this->product1->id, 'quantity' => 1]],
        ];

        $response = $this->postJson('/api/combos', $payload);

        $response->assertStatus(401);
    }

    public function test_combos_store_validation_fails_with_missing_fields(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/combos', []);

        $response
            ->assertStatus(422)
            ->assertJsonStructure(['success', 'message', 'code', 'errors']);
    }

    public function test_combos_store_validation_fails_with_empty_items_array(): void
    {
        $payload = [
            'name' => 'Invalid Combo',
            'daily_price' => 2000,
            'description' => 'Combo without items',
            'items' => [],
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/combos', $payload);

        $response
            ->assertStatus(422)
            ->assertJsonStructure(['success', 'message', 'code', 'errors']);
    }

    public function test_combos_store_validation_fails_with_invalid_product_id(): void
    {
        $payload = [
            'name' => 'Invalid Combo',
            'daily_price' => 2000,
            'description' => 'Combo with invalid product',
            'items' => [['product_id' => 99999, 'quantity' => 1]],
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/combos', $payload);

        $response
            ->assertStatus(422)
            ->assertJsonStructure(['success', 'message', 'code', 'errors']);
    }

    public function test_combos_store_validation_fails_with_duplicate_products(): void
    {
        $payload = [
            'name' => 'Invalid Combo',
            'daily_price' => 2000,
            'description' => 'Combo with duplicate products',
            'items' => [
                ['product_id' => $this->product1->id, 'quantity' => 1],
                ['product_id' => $this->product1->id, 'quantity' => 2],
            ],
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/combos', $payload);

        $response
            ->assertStatus(422)
            ->assertJsonStructure(['success', 'message', 'code', 'errors']);
    }
}
