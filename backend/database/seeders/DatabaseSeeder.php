<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([RolePermissionSeeder::class, ComboPresetSeeder::class]);

        // User::factory(10)->create();

        $user = User::factory()->create([
            'email' => 'test@example.com',
            'hash_password' => 'password123',
            'full_name' => 'Test User',
            'phone' => '0912345678',
            'status' => 'ACTIVE',
            'created_at' => now(),
        ]);

        $customerRole = Role::where('name', 'CUSTOMER')->first();
        if ($customerRole) {
            $user->roles()->syncWithoutDetaching([$customerRole->id]);
        }
    }
}
