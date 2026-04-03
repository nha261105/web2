<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Keep unique constraint, only expand type to support module-level permission names.
        DB::statement(
            'ALTER TABLE permissions MODIFY name VARCHAR(100) NOT NULL',
        );
    }

    public function down(): void
    {
        DB::statement(
            "ALTER TABLE permissions MODIFY name ENUM('CREATE', 'DELETE', 'UPDATE', 'READ') NOT NULL",
        );
    }
};
