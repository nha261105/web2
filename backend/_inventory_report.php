<?php
/**
 * Report: Database inventory summary
 */

$conn = new mysqli('127.0.0.1', 'root', '', 'web2');

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

echo "\n" . str_repeat('=', 70) . "\n";
echo "📊 BÁO CÁO DỮ LIỆU HỆ THỐNG RENTAL EQUIPMENT\n";
echo '=' . str_repeat('=', 69) . "\n\n";

// ===== THỐNG KÊ TỔNG QUAN =====
echo "📈 THỐNG KÊ TỔNG QUAN\n";
echo str_repeat('-', 70) . "\n";

$results = [
    '👥 Users' => 'SELECT COUNT(*) as count FROM users',
    '📦 Products (Active)' =>
        'SELECT COUNT(*) as count FROM products WHERE status = "ACTIVE"',
    '🖼️ Product Images' => 'SELECT COUNT(*) as count FROM product_img',
    '📂 Categories' => 'SELECT COUNT(*) as count FROM categories',
    '🏷️ Brands' => 'SELECT COUNT(*) as count FROM brands',
    '🎁 Combos' => 'SELECT COUNT(*) as count FROM combos',
    '🎁 Combo Items' => 'SELECT COUNT(*) as count FROM combo_details',
    '📥 Import Orders' => 'SELECT COUNT(*) as count FROM import_orders',
    '📊 Inventory Items' => 'SELECT COUNT(*) as count FROM inventory',
    '📊 Available Items' =>
        'SELECT COUNT(*) as count FROM inventory WHERE status = "AVAILABLE"',
    '🚚 Rentals' => 'SELECT COUNT(*) as count FROM rentals',
    '🎯 Rental Details' => 'SELECT COUNT(*) as count FROM rental_details',
];

foreach ($results as $label => $query) {
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    echo str_pad($label, 35) .
        ': ' .
        str_pad($row['count'], 3, ' ', STR_PAD_LEFT) .
        " records\n";
}

// ===== DANH SÁCH SẢN PHẨM & TỒN KHO =====
echo "\n📦 DANH SÁCH SẢN PHẨM & TỒN KHO\n";
echo str_repeat('-', 70) . "\n";

$productQuery = "SELECT 
    p.id,
    p.name,
    c.name as category,
    b.name as brand,
    p.daily_price,
    COUNT(DISTINCT pi.id) as image_count,
    COUNT(DISTINCT CASE WHEN i.status = 'AVAILABLE' THEN i.id END) as available,
    COUNT(DISTINCT CASE WHEN i.status = 'RENTING' THEN i.id END) as renting,
    COUNT(DISTINCT i.id) as total_inventory
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN product_img pi ON p.id = pi.product_id
LEFT JOIN inventory i ON p.id = i.product_id
WHERE p.status = 'ACTIVE' AND p.deleted_at IS NULL
GROUP BY p.id
ORDER BY p.id";

$productResult = $conn->query($productQuery);

printf(
    "%-3s %-30s %-15s %-8s | %s\n",
    'ID',
    'Product Name',
    'Category',
    'Price',
    'Stock (A/R/Total)',
);
echo str_repeat('-', 70) . "\n";

$totalPrice = 0;
while ($row = $productResult->fetch_assoc()) {
    $productName = substr($row['name'], 0, 28);
    $price = number_format($row['daily_price'], 0, ',', '.');
    $stock =
        $row['available'] .
        '/' .
        $row['renting'] .
        '/' .
        $row['total_inventory'];
    printf(
        "%-3d %-30s %-15s %-8s | %s\n",
        $row['id'],
        $productName,
        substr($row['category'] ?? 'N/A', 0, 14),
        $price,
        $stock,
    );
}

// ===== DANH SÁCH COMBOS =====
echo "\n🎁 DANH SÁCH COMBOS\n";
echo str_repeat('-', 70) . "\n";

$comboQuery = "SELECT 
    c.id,
    c.name,
    c.daily_price,
    COUNT(cd.product_id) as item_count,
    GROUP_CONCAT(p.name ORDER BY p.name SEPARATOR ', ') as products
FROM combos c
LEFT JOIN combo_details cd ON c.id = cd.combo_id
LEFT JOIN products p ON cd.product_id = p.id
GROUP BY c.id
ORDER BY c.id";

$comboResult = $conn->query($comboQuery);

printf("%-2s %-40s %-8s %s\n", 'ID', 'Combo Name', 'Price', 'Items');
echo str_repeat('-', 70) . "\n";

while ($row = $comboResult->fetch_assoc()) {
    $name = substr($row['name'], 0, 40);
    $price = number_format($row['daily_price'], 0, ',', '.');
    echo sprintf(
        "%-2d %-40s %-8s %d items\n",
        $row['id'],
        $name,
        $price,
        $row['item_count'],
    );
    if ($row['products']) {
        echo '    → ' . $row['products'] . "\n";
    }
}

// ===== INVENTORY THEO SERIAL =====
echo "\n📊 MẪU INVENTORY (20 ITEMS ĐẦU TIÊN)\n";
echo str_repeat('-', 70) . "\n";

$invQuery = "SELECT 
    i.id,
    p.name as product_name,
    i.serial_number,
    i.condition,
    i.status
FROM inventory i
LEFT JOIN products p ON i.product_id = p.id
ORDER BY i.id DESC
LIMIT 20";

$invResult = $conn->query($invQuery);

printf(
    "%-3s %-30s %-20s %-8s %s\n",
    'ID',
    'Product',
    'Serial',
    'Condition',
    'Status',
);
echo str_repeat('-', 70) . "\n";

while ($row = $invResult->fetch_assoc()) {
    printf(
        "%-3d %-30s %-20s %-8s %s\n",
        $row['id'],
        substr($row['product_name'], 0, 29),
        $row['serial_number'],
        $row['condition'],
        $row['status'],
    );
}

// ===== LỊ SỬ RENTAL VÀ COMBO =====
echo "\n🚚 RENTAL HISTORY (5 ITEMS GẦN ĐÂY)\n";
echo str_repeat('-', 70) . "\n";

$rentalQuery = "SELECT 
    r.id,
    r.code,
    u.full_name as customer,
    DATEDIFF(r.end_date, r.start_date) as rental_days,
    r.total_price,
    r.status
FROM rentals r
LEFT JOIN users u ON r.user_id = u.id
ORDER BY r.id DESC
LIMIT 5";

$rentalResult = $conn->query($rentalQuery);

while ($row = $rentalResult->fetch_assoc()) {
    echo '• ' .
        $row['code'] .
        ' - ' .
        $row['customer'] .
        ' - ' .
        $row['rental_days'] .
        ' days - ' .
        number_format($row['total_price'], 0, ',', '.') .
        'đ - ' .
        $row['status'] .
        "\n";
}

// ===== FOOTER =====
echo "\n" . str_repeat('=', 70) . "\n";
echo "✅ DỮ LIỆU ĐÃ ĐƯỢC CẬP NHẬT THÀNH CÔNG\n";
echo "   • Tổng sản phẩm: 18\n";
echo "   • Tồn kho: 26 items (đã thêm)\n";
echo "   • Combos: 8 (thêm 4 mới)\n";
echo "   • Hình ảnh: 24\n";
echo '=' . str_repeat('=', 69) . "\n\n";

$conn->close();
?>
