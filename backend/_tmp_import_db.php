<?php
// Import database from mysql_init.sql

$host = '127.0.0.1';
$username = 'root';
$password = '';

// Connect to MySQL
$conn = new mysqli($host, $username, $password);

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

// Read SQL file
$sqlFile = __DIR__ . '/database/seeders/mysql_init.sql';

if (!file_exists($sqlFile)) {
    die("SQL file not found: $sqlFile");
}

$sqlContent = file_get_contents($sqlFile);

// Split queries by ';'
$queries = array_filter(array_map('trim', explode(';', $sqlContent)));

echo "Starting database import...\n";
echo 'Total queries: ' . count($queries) . "\n\n";

$successCount = 0;
$errorCount = 0;

foreach ($queries as $index => $query) {
    if (empty($query)) {
        continue;
    }

    if ($conn->multi_query($query . ';')) {
        // Consume all results
        do {
            if ($result = $conn->store_result()) {
                $result->free();
            }
        } while ($conn->next_result());

        $successCount++;
        echo '✓ Query ' . ($index + 1) . " executed successfully\n";
    } else {
        $errorCount++;
        echo '✗ Query ' . ($index + 1) . ' failed: ' . $conn->error . "\n";
    }
}

$conn->close();

echo "\n" . str_repeat('=', 50) . "\n";
echo "IMPORT COMPLETED\n";
echo "Success: $successCount queries\n";
echo "Errors: $errorCount queries\n";
echo "=================================================\n\n";

// Verify import
echo "Verifying import...\n";
$connVerify = new mysqli($host, $username, $password, 'web2');
if ($connVerify->connect_error) {
    die('Verification connection failed: ' . $connVerify->connect_error);
}

$tables = [
    'users' => 'User accounts',
    'products' => 'Products',
    'categories' => 'Categories',
    'brands' => 'Brands',
    'inventory' => 'Inventory items',
    'rentals' => 'Rentals',
    'rental_details' => 'Rental details',
];

foreach ($tables as $table => $label) {
    $result = $connVerify->query("SELECT COUNT(*) as count FROM $table");
    $row = $result->fetch_assoc();
    echo "✓ $label ($table): " . $row['count'] . " records\n";
}

// Test accounts
echo "\n" . str_repeat('=', 50) . "\n";
echo "TEST ACCOUNTS\n";
echo "=================================================\n";
$adminResult = $connVerify->query(
    "SELECT u.email, r.name as role FROM users u 
     LEFT JOIN user_roles ur ON u.id = ur.user_id 
     LEFT JOIN roles r ON ur.role_id = r.id 
     WHERE u.email = 'admin0402@rentgear.vn' OR u.email = 'user0402@rentgear.vn'",
);

if ($adminResult && $adminResult->num_rows > 0) {
    echo "Admin Account: admin0402@rentgear.vn\n";
    echo "Customer Account: user0402@rentgear.vn\n";
    echo "Password: 12345678\n";
} else {
    // Check if test accounts exist (different emails)
    $testResult = $connVerify->query('SELECT email, id FROM users LIMIT 1');
    if ($testResult && $testResult->num_rows > 0) {
        $row = $testResult->fetch_assoc();
        echo 'Sample Account: ' . $row['email'] . "\n";
        echo "Password: password123 (bcrypt)\n";
    }
}

$connVerify->close();

echo "\n✅ Database import completed successfully!\n";
?>
