<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('rental_polices') && !Schema::hasTable('rental_policies')) {
            Schema::rename('rental_polices', 'rental_policies');
        }

        if (Schema::hasTable('inventory')) {
            DB::statement("UPDATE inventory SET status = 'MAINTENANCE' WHERE status = 'MAINTENACE'");
            DB::statement("ALTER TABLE inventory MODIFY status ENUM('AVAILABLE','RENTING','MAINTENANCE','LOST') NOT NULL");
        }

        if (Schema::hasTable('maintenance_logs')) {
            DB::statement("UPDATE maintenance_logs SET status = 'MAINTENANCED' WHERE status = 'MANTENMANCED'");
            DB::statement("ALTER TABLE maintenance_logs MODIFY status ENUM('INVENTORY','MAINTENANCED') NOT NULL");
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('maintenance_logs')) {
            DB::statement("UPDATE maintenance_logs SET status = 'MANTENMANCED' WHERE status = 'MAINTENANCED'");
            DB::statement("ALTER TABLE maintenance_logs MODIFY status ENUM('INVENTORY','MANTENMANCED') NOT NULL");
        }

        if (Schema::hasTable('inventory')) {
            DB::statement("UPDATE inventory SET status = 'MAINTENACE' WHERE status = 'MAINTENANCE'");
            DB::statement("ALTER TABLE inventory MODIFY status ENUM('AVAILABLE','RENTING','MAINTENACE','LOST') NOT NULL");
        }

        if (Schema::hasTable('rental_policies') && !Schema::hasTable('rental_polices')) {
            Schema::rename('rental_policies', 'rental_polices');
        }
    }
};
