<?php
/**
 * Script thêm dữ liệu products, inventory, combos vào database web2
 * Chỉ thêm dữ liệu mới, bỏ qua những cái đã tồn tại
 */

$conn = new mysqli('127.0.0.1', 'root', '', 'web2');

if ($conn->connect_error) {
    die('❌ Connection failed: ' . $conn->connect_error);
}

echo "🔄 Đang kiểm tra và thêm dữ liệu...\n\n";

// ===== THÊM SẢN PHẨM MỚI (CHECK EXIST TRƯỚC) =====
echo "📦 Kiểm tra và thêm sản phẩm mới...\n";

$newProducts = [
    [
        'policies_id' => 2,
        'category_id' => 1,
        'brand_id' => 3,
        'name' => 'Nikon Z9',
        'slug' => 'nikon-z9',
        'daily_price' => 750000,
        'deposit_price' => 7500000,
        'description' =>
            'Máy ảnh mirrorless flagship, 8K video, 45.7MP, autofocus cực nhanh.',
    ],
    [
        'policies_id' => 1,
        'category_id' => 2,
        'brand_id' => 3,
        'name' => 'Nikon Z 24-70mm f/2.8',
        'slug' => 'nikon-z-24-70-f28',
        'daily_price' => 400000,
        'deposit_price' => 4000000,
        'description' =>
            'Ống kính zoom cao cấp, khẩu độ f/2.8 cố định, AF siêu nhanh.',
    ],
    [
        'policies_id' => 3,
        'category_id' => 3,
        'brand_id' => 4,
        'name' => 'DJI Air 3S',
        'slug' => 'dji-air-3s',
        'daily_price' => 550000,
        'deposit_price' => 5500000,
        'description' =>
            'Flycam gọn nhẹ, camera 1 inch, bay 31 phút, quay 4K 60fps.',
    ],
    [
        'policies_id' => 1,
        'category_id' => 5,
        'brand_id' => 5,
        'name' => 'Rode Wireless GO II',
        'slug' => 'rode-wireless-go-ii',
        'daily_price' => 120000,
        'deposit_price' => 800000,
        'description' =>
            'Micro không dây siêu nhỏ, range 200m, pin 7 giờ, cổng USB-C.',
    ],
    [
        'policies_id' => 1,
        'category_id' => 6,
        'brand_id' => 6,
        'name' => 'Godox UB-130D Softbox',
        'slug' => 'godox-ub-130d',
        'daily_price' => 80000,
        'deposit_price' => 600000,
        'description' =>
            'Softbox 130cm, chiếu sáng mềm đều, tương thích tất cả đèn flash.',
    ],
    [
        'policies_id' => 2,
        'category_id' => 1,
        'brand_id' => 1,
        'name' => 'Sony A1',
        'slug' => 'sony-a1',
        'daily_price' => 900000,
        'deposit_price' => 9000000,
        'description' =>
            'Máy ảnh mirrorless tiền tỷ, 50MP, 30fps silent, 8K RAW.',
    ],
    [
        'policies_id' => 1,
        'category_id' => 4,
        'brand_id' => 4,
        'name' => 'DJI Osmo Mobile 6',
        'slug' => 'dji-osmo-mobile-6',
        'daily_price' => 140000,
        'deposit_price' => 900000,
        'description' =>
            'Gimbal điện thoại 3 trục, ổn định xuất sắc, pin 15 giờ.',
    ],
    [
        'policies_id' => 1,
        'category_id' => 6,
        'brand_id' => 6,
        'name' => 'Godox SL-100W',
        'slug' => 'godox-sl-100w',
        'daily_price' => 280000,
        'deposit_price' => 2000000,
        'description' =>
            'Đèn LED studio 100W, RGBWW, điều khiển từ xa, không flickering.',
    ],
    [
        'policies_id' => 1,
        'category_id' => 2,
        'brand_id' => 2,
        'name' => 'Canon RF 70-200mm f/2.8',
        'slug' => 'canon-rf-70-200-f28',
        'daily_price' => 380000,
        'deposit_price' => 3800000,
        'description' =>
            'Ống kính tele cao cấp, f/2.8 cố định, 5.2 stops IBIS.',
    ],
    [
        'policies_id' => 2,
        'category_id' => 1,
        'brand_id' => 7,
        'name' => 'Fujifilm GFX100S',
        'slug' => 'fujifilm-gfx100s',
        'daily_price' => 850000,
        'deposit_price' => 8500000,
        'description' =>
            'Máy ảnh trung bình định dạng, 102MP, kích thước nhỏ gọn.',
    ],
];

$addedProducts = [];
$skippedProducts = 0;

foreach ($newProducts as $prod) {
    $checkSql =
        "SELECT id FROM products WHERE slug = '" .
        $conn->escape_string($prod['slug']) .
        "'";
    $checkResult = $conn->query($checkSql);

    if ($checkResult->num_rows > 0) {
        $row = $checkResult->fetch_assoc();
        $addedProducts[$prod['name']] = $row['id'];
        echo '  ⊘ ' . $prod['name'] . " (Đã tồn tại)\n";
        $skippedProducts++;
        continue;
    }

    $desc = $conn->escape_string($prod['description']);
    $sql = "INSERT INTO products (policies_id, category_id, brand_id, name, slug, daily_price, deposit_price, description, status, created_at, updated_at)
            VALUES ({$prod['policies_id']}, {$prod['category_id']}, {$prod['brand_id']}, '{$prod['name']}', '{$prod['slug']}', {$prod['daily_price']}, {$prod['deposit_price']}, '$desc', 'ACTIVE', NOW(), NOW())";

    if ($conn->query($sql)) {
        $productId = $conn->insert_id;
        $addedProducts[$prod['name']] = $productId;
        echo '  ✓ ' . $prod['name'] . " (ID: $productId)\n";
    } else {
        echo '  ✗ ' . $prod['name'] . ' - Error: ' . $conn->error . "\n";
    }
}

echo '  → Thêm: ' .
    (count($addedProducts) - $skippedProducts) .
    ", Bỏ qua: $skippedProducts\n";

// ===== THÊM HÌNH ẢNH CHO SẢN PHẨM =====
echo "\n🖼️ Thêm hình ảnh sản phẩm...\n";

$productImages = [
    'Nikon Z9' => [
        'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/nikon/z9-1.jpg',
        'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/nikon/z9-2.jpg',
    ],
    'Nikon Z 24-70mm f/2.8' => [
        'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/nikon/z24-70-1.jpg',
    ],
    'DJI Air 3S' => [
        'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/dji/air3s-1.jpg',
        'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/dji/air3s-2.jpg',
    ],
    'Rode Wireless GO II' => [
        'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/rode/wireless-go2.jpg',
    ],
    'Godox UB-130D Softbox' => [
        'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/godox/softbox-130.jpg',
    ],
    'Sony A1' => [
        'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/sony/a1-1.jpg',
        'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/sony/a1-2.jpg',
    ],
    'DJI Osmo Mobile 6' => [
        'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/dji/osmo-mobile-6.jpg',
    ],
    'Godox SL-100W' => [
        'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/godox/sl-100w.jpg',
    ],
    'Canon RF 70-200mm f/2.8' => [
        'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/canon/rf70-200.jpg',
    ],
    'Fujifilm GFX100S' => [
        'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/fujifilm/gfx100s.jpg',
    ],
];

foreach ($productImages as $productName => $images) {
    if (!isset($addedProducts[$productName])) {
        continue;
    }

    $productId = $addedProducts[$productName];
    $checkImg = $conn->query(
        "SELECT COUNT(*) as count FROM product_img WHERE product_id = $productId",
    );
    $imgRow = $checkImg->fetch_assoc();

    if ($imgRow['count'] > 0) {
        echo "  ⊘ ID $productId - Images đã tồn tại\n";
        continue;
    }

    $inserted = 0;
    foreach ($images as $imageUrl) {
        $sql = "INSERT INTO product_img (product_id, image_url) VALUES ($productId, '$imageUrl')";
        if ($conn->query($sql)) {
            $inserted++;
        }
    }
    echo "  ✓ ID $productId - $inserted ảnh\n";
}

// ===== THÊM INVENTORY =====
echo "\n📊 Thêm inventory items...\n";

$serialPatterns = [
    'Nikon Z9' => ['NIKON-Z9', 3],
    'Nikon Z 24-70mm f/2.8' => ['NKN-RF70200', 2],
    'DJI Air 3S' => ['DJI-AIR3S', 3],
    'Rode Wireless GO II' => ['RODE-WGO2', 4],
    'Godox UB-130D Softbox' => ['GODX-SOFT130', 3],
    'Sony A1' => ['SONY-A1', 2],
    'DJI Osmo Mobile 6' => ['DJI-OSMO6', 2],
    'Godox SL-100W' => ['GODX-SL100', 2],
    'Canon RF 70-200mm f/2.8' => ['CAN-RF70200', 2],
    'Fujifilm GFX100S' => ['FJ-GFX100S', 3],
];

foreach ($serialPatterns as $productName => $data) {
    if (!isset($addedProducts[$productName])) {
        continue;
    }

    $productId = $addedProducts[$productName];
    [$pattern, $quantity] = $data;

    $checkInv = $conn->query(
        "SELECT COUNT(*) as count FROM inventory WHERE product_id = $productId",
    );
    $invRow = $checkInv->fetch_assoc();

    if ($invRow['count'] > 0) {
        echo "  ⊘ ID $productId - Inventory đã tồn tại\n";
        continue;
    }

    $lastImportId = 1;
    $importCheck = $conn->query(
        'SELECT id FROM import_orders ORDER BY id DESC LIMIT 1',
    );
    if ($importCheck->num_rows > 0) {
        $imp = $importCheck->fetch_assoc();
        $lastImportId = $imp['id'];
    }

    $inserted = 0;
    for ($i = 1; $i <= $quantity; $i++) {
        $serial = $pattern . '-' . str_pad($i, 3, '0', STR_PAD_LEFT);
        $condition = $i === 1 ? 'NEW' : 'GOOD';

        $sql = "INSERT INTO inventory (product_id, import_order_id, `condition`, status, serial_number)
                VALUES ($productId, $lastImportId, '$condition', 'AVAILABLE', '$serial')";

        if ($conn->query($sql)) {
            $inserted++;
        }
    }
    echo "  ✓ ID $productId - $inserted items\n";
}

// ===== THÊM COMBOS =====
echo "\n🎁 Thêm combo packages...\n";

$combos = [
    [
        'name' => 'Combo Chuyên gia Nikon Z',
        'daily_price' => 1250000,
        'description' => 'Nikon Z9 + Nikon Z 24-70mm f/2.8 + Godox SL-100W',
        'products' => ['Nikon Z9', 'Nikon Z 24-70mm f/2.8', 'Godox SL-100W'],
    ],
    [
        'name' => 'Combo Quay video Flycam Hoàn hảo',
        'daily_price' => 650000,
        'description' => 'DJI Air 3S + DJI Osmo Mobile 6 + Rode Wireless GO II',
        'products' => [
            'DJI Air 3S',
            'DJI Osmo Mobile 6',
            'Rode Wireless GO II',
        ],
    ],
    [
        'name' => 'Combo Studio Canon Pro',
        'daily_price' => 1500000,
        'description' => 'Sony A1 + Canon RF 70-200mm + Godox SL-100W',
        'products' => ['Sony A1', 'Canon RF 70-200mm f/2.8', 'Godox SL-100W'],
    ],
    [
        'name' => 'Combo Medium Format Fu',
        'daily_price' => 1800000,
        'description' => 'Fujifilm GFX100S + Nikon Z9 + Godox SL-100W x2',
        'products' => ['Fujifilm GFX100S', 'Nikon Z9', 'Godox SL-100W'],
    ],
];

$addedCombos = 0;
foreach ($combos as $combo) {
    $checkCombo = $conn->query(
        "SELECT id FROM combos WHERE name = '" .
            $conn->escape_string($combo['name']) .
            "'",
    );
    if ($checkCombo->num_rows > 0) {
        echo '  ⊘ ' . $combo['name'] . " (Đã tồn tại)\n";
        continue;
    }

    $desc = $conn->escape_string($combo['description']);
    $sql = "INSERT INTO combos (name, daily_price, description)
            VALUES ('{$combo['name']}', {$combo['daily_price']}, '$desc')";

    if ($conn->query($sql)) {
        $comboId = $conn->insert_id;
        $addedCombos++;
        echo '  ✓ ' . $combo['name'] . " (ID: $comboId)\n";

        foreach ($combo['products'] as $prodName) {
            if (!isset($addedProducts[$prodName])) {
                continue;
            }
            $prodId = $addedProducts[$prodName];
            $sqlDetail = "INSERT INTO combo_details (combo_id, product_id, quantity) VALUES ($comboId, $prodId, 1)";
            $conn->query($sqlDetail);
        }
    } else {
        echo '  ✗ ' . $combo['name'] . ' - Error: ' . $conn->error . "\n";
    }
}

// ===== THỐNG KÊ CUỐI CÙNG =====
echo "\n" . str_repeat('=', 60) . "\n";
echo "📊 THỐNG KÊ CUỐI CÙNG\n";
echo '=' . str_repeat('=', 59) . "\n";

$stats = [
    'Products (ACTIVE)' =>
        'SELECT COUNT(*) as count FROM products WHERE status = "ACTIVE"',
    'Product Images' => 'SELECT COUNT(*) as count FROM product_img',
    'Inventory Items' =>
        'SELECT COUNT(*) as count FROM inventory WHERE status = "AVAILABLE"',
    'Combos' => 'SELECT COUNT(*) as count FROM combos',
    'Categories' => 'SELECT COUNT(*) as count FROM categories',
    'Brands' => 'SELECT COUNT(*) as count FROM brands',
];

foreach ($stats as $label => $query) {
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    echo str_pad($label, 30) .
        ': ' .
        str_pad($row['count'], 4, ' ', STR_PAD_LEFT) .
        "\n";
}

echo '=' . str_repeat('=', 59) . "\n";
echo "\n✅ HOÀN THÀNH!\n";
echo '   • Sản phẩm thêm: ' . (count($addedProducts) - $skippedProducts) . "\n";
echo "   • Combos thêm: $addedCombos\n\n";

$conn->close();
?>
