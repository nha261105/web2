<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissionNames = ['CREATE', 'READ', 'UPDATE', 'DELETE'];

        foreach ($permissionNames as $name) {
            Permission::firstOrCreate(['name' => $name]);
        }

        $admin = Role::firstOrCreate(['name' => 'ADMIN']);
        $staff = Role::firstOrCreate(['name' => 'STAFF']);
        $customer = Role::firstOrCreate(['name' => 'CUSTOMER']);

        $admin->permissions()->sync(Permission::pluck('id')->all());

        $staff->permissions()->sync(
            Permission::whereIn('name', ['READ', 'UPDATE'])
                ->pluck('id')
                ->all(),
        );

        $customer->permissions()->sync(
            Permission::whereIn('name', ['READ'])
                ->pluck('id')
                ->all(),
        );
    }
}
