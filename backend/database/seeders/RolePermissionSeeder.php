<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissionNames = [
            'CREATE',
            'READ',
            'UPDATE',
            'DELETE',
            'ADMIN_DASHBOARD_VIEW',
            'RBAC_READ',
            'RBAC_UPDATE',
            'USER_READ',
            'USER_UPDATE',
            'USER_DELETE',
            'PRODUCT_READ',
            'PRODUCT_CREATE',
            'PRODUCT_UPDATE',
            'PRODUCT_DELETE',
            'CATEGORY_READ',
            'CATEGORY_CREATE',
            'CATEGORY_UPDATE',
            'CATEGORY_DELETE',
            'BRAND_READ',
            'BRAND_CREATE',
            'BRAND_UPDATE',
            'BRAND_DELETE',
            'COMBO_READ',
            'COMBO_CREATE',
            'COMBO_UPDATE',
            'COMBO_DELETE',
            'COUPON_READ',
            'COUPON_CREATE',
            'COUPON_UPDATE',
            'COUPON_DELETE',
            'RENTAL_READ',
            'RENTAL_CREATE',
            'RENTAL_UPDATE',
            'RETURN_ORDER_CREATE',
            'RETURN_ORDER_UPDATE',
            'RENTAL_ISSUE_READ',
            'RENTAL_ISSUE_CREATE',
            'RENTAL_ISSUE_UPDATE',
            'TRANSACTION_CREATE',
            'TRANSACTION_UPDATE',
            'RENTAL_POLICY_READ',
            'RENTAL_POLICY_CREATE',
            'RENTAL_POLICY_UPDATE',
            'RENTAL_POLICY_DELETE',
        ];

        foreach ($permissionNames as $name) {
            Permission::firstOrCreate(['name' => $name]);
        }

        $admin = Role::firstOrCreate(['name' => 'ADMIN']);
        $staff = Role::firstOrCreate(['name' => 'STAFF']);
        $customer = Role::firstOrCreate(['name' => 'CUSTOMER']);

        // ADMIN must always have every permission.
        $admin->permissions()->sync(Permission::pluck('id')->all());

        $staff->permissions()->sync(
            Permission::whereIn('name', [
                'COMBO_READ',
                'COMBO_UPDATE',
                'COMBO_CREATE',
                'COMBO_DELETE',
            ])
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
