<?php
/**
 * Add inventory quantity for active products.
 * Rule: each active product gets +2 available items.
 */

$conn = new mysqli('127.0.0.1', 'root', '', 'web2');

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error . "\n");
}

$before =
    (int) ($conn->query('SELECT COUNT(*) AS c FROM inventory')->fetch_assoc()[
        'c'
    ] ?? 0);
$beforeAvailable =
    (int) ($conn
        ->query("SELECT COUNT(*) AS c FROM inventory WHERE status='AVAILABLE'")
        ->fetch_assoc()['c'] ?? 0);

$importOrderIdResult = $conn->query(
    'SELECT id FROM import_orders ORDER BY id DESC LIMIT 1',
);
$importOrderId = (int) ($importOrderIdResult->fetch_assoc()['id'] ?? 0);

if ($importOrderId <= 0) {
    die("No import order found. Please seed import_orders first.\n");
}

$productResult = $conn->query(
    "SELECT id, name FROM products WHERE status='ACTIVE' AND deleted_at IS NULL ORDER BY id",
);
if (!$productResult) {
    die('Cannot load products: ' . $conn->error . "\n");
}

$insertStmt = $conn->prepare(
    "INSERT INTO inventory (product_id, import_order_id, `condition`, status, serial_number, notes, purchased_at)
     VALUES (?, ?, 'GOOD', 'AVAILABLE', ?, 'Auto added quantity', NOW())",
);

if (!$insertStmt) {
    die('Prepare failed: ' . $conn->error . "\n");
}

$added = 0;
$addedPerProduct = 2;

echo "Adding inventory quantity (+{$addedPerProduct}/product)...\n\n";

while ($product = $productResult->fetch_assoc()) {
    $productId = (int) $product['id'];
    $productName = $product['name'];

    for ($i = 1; $i <= $addedPerProduct; $i++) {
        $serial = sprintf(
            'P%02d-AUTO-%s',
            $productId,
            strtoupper(
                substr(
                    md5(uniqid((string) $productId . '-' . (string) $i, true)),
                    0,
                    8,
                ),
            ),
        );

        $insertStmt->bind_param('iis', $productId, $importOrderId, $serial);
        if ($insertStmt->execute()) {
            $added++;
        }
    }

    echo "- Product #{$productId}: {$productName} -> +{$addedPerProduct}\n";
}

$after =
    (int) ($conn->query('SELECT COUNT(*) AS c FROM inventory')->fetch_assoc()[
        'c'
    ] ?? 0);
$afterAvailable =
    (int) ($conn
        ->query("SELECT COUNT(*) AS c FROM inventory WHERE status='AVAILABLE'")
        ->fetch_assoc()['c'] ?? 0);

echo "\nDone.\n";
echo "Inventory total   : {$before} -> {$after} ( +" .
    ($after - $before) .
    " )\n";
echo "Available total   : {$beforeAvailable} -> {$afterAvailable} ( +" .
    ($afterAvailable - $beforeAvailable) .
    " )\n";

$insertStmt->close();
$conn->close();
