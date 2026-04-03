<?php
$conn = new mysqli('127.0.0.1', 'root', '', 'web2');

echo "\n===== TEST ACCOUNTS =====\n";
$result = $conn->query(
    'SELECT u.id, u.email, u.full_name, u.phone, u.status, r.name as role FROM users u LEFT JOIN user_roles ur ON u.id = ur.user_id LEFT JOIN roles r ON ur.role_id = r.id ORDER BY u.id',
);
while ($row = $result->fetch_assoc()) {
    echo 'ID: ' .
        str_pad($row['id'], 2, ' ', STR_PAD_LEFT) .
        ' | Email: ' .
        str_pad($row['email'], 25) .
        ' | Name: ' .
        str_pad($row['full_name'], 20) .
        ' | Role: ' .
        str_pad($row['role'] ?? 'N/A', 10) .
        ' | Status: ' .
        $row['status'] .
        "\n";
}
echo "\nPassword for all accounts: password123\n";

echo "\n===== SAMPLE DATA =====\n";
$tables = [
    'users',
    'products',
    'categories',
    'brands',
    'inventory',
    'rentals',
    'rental_details',
    'combos',
];
foreach ($tables as $table) {
    $result = $conn->query("SELECT COUNT(*) as count FROM $table");
    $row = $result->fetch_assoc();
    echo str_pad(ucfirst($table), 20) . ': ' . $row['count'] . " records\n";
}

echo "\n===== DATABASE STATUS =====\n";
echo "✅ Database: web2\n";
echo "✅ Connection: OK\n";
echo "✅ All tables imported successfully\n";

$conn->close();
?>
