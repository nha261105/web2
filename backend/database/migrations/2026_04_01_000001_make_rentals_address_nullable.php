<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('rentals')) {
            return;
        }

        Schema::table('rentals', function (Blueprint $table) {
            if (Schema::hasColumn('rentals', 'address_id')) {
                $table->dropForeign(['address_id']);
            }
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE rentals MODIFY address_id BIGINT UNSIGNED NULL');
            DB::statement('ALTER TABLE rentals ADD CONSTRAINT rentals_address_id_foreign FOREIGN KEY (address_id) REFERENCES addresses(id)');
        } else {
            Schema::table('rentals', function (Blueprint $table) {
                $table->foreignId('address_id')->nullable()->constrained('addresses')->change();
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('rentals')) {
            return;
        }

        Schema::table('rentals', function (Blueprint $table) {
            if (!Schema::hasColumn('rentals', 'address_id')) {
                $table->integer('address_id')->nullable();
            }
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE rentals MODIFY address_id BIGINT UNSIGNED NOT NULL');
            DB::statement('ALTER TABLE rentals ADD CONSTRAINT rentals_address_id_foreign FOREIGN KEY (address_id) REFERENCES addresses(id)');
        } else {
            Schema::table('rentals', function (Blueprint $table) {
                $table->foreignId('address_id')->constrained('addresses')->change();
            });
        }
    }
};
