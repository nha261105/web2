<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$foreignKeys = DB::select("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'policies_id' AND REFERENCED_TABLE_NAME IS NOT NULL");

foreach ($foreignKeys as $fk) {
    echo "Dropping FK: " . $fk->CONSTRAINT_NAME . "\n";
    DB::statement('ALTER TABLE products DROP FOREIGN KEY ' . $fk->CONSTRAINT_NAME);
}

try {
    DB::statement('ALTER TABLE products DROP COLUMN policies_id');
    echo "Dropped policies_id column.\n";
} catch (\Exception $e) {
    echo "Column drop failed or already dropped: " . $e->getMessage() . "\n";
}
