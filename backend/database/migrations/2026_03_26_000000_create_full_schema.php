<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('hash_password');
            $table->string('full_name');
            $table->string('phone', 50)->unique();
            $table->enum('status', ['ACTIVE', 'INACTIVE']);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
        });

        Schema::create('user_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->string('token', 255)->unique();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('lastused_at')->nullable();
        });

        Schema::create('user_info', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->string('card_id', 50);
            $table->text('user_img');
            $table->enum('status', ['PENDING', 'VERIFIED', 'REJECTED']);
        });

        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->string('receive_name');
            $table->string('receive_phone', 50);
            $table->string('city', 100);
            $table->string('district', 100);
            $table->string('ward', 100);
            $table->text('street');
            $table->boolean('is_default');
            $table->timestamps();
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->enum('name', ['ADMIN', 'CUSTOMER', 'STAFF'])->unique();
        });

        Schema::create('user_roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('role_id')->constrained('roles');
            $table->unique(['user_id', 'role_id']);
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table
                ->enum('name', ['CREATE', 'DELETE', 'UPDATE', 'READ'])
                ->unique();
        });

        Schema::create('role_has_permission', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained('roles');
            $table->foreignId('permission_id')->constrained('permissions');
            $table->unique(['role_id', 'permission_id']);
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('slug')->nullable()->unique();
        });

        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('logo')->nullable();
        });

        Schema::create('rental_polices', function (Blueprint $table) {
            $table->id();
            $table->decimal('late_day_fee', 10, 2);
            $table->integer('max_late_day');
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('policies_id')->constrained('rental_polices');
            $table->foreignId('category_id')->constrained('categories');
            $table->foreignId('brand_id')->constrained('brands');
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('daily_price', 10, 2);
            $table->decimal('deposit_price', 10, 2);
            $table->text('description');
            $table->enum('status', ['ACTIVE', 'INACTIVE']);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
        });

        Schema::create('product_img', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products');
            $table->text('image_url');
        });

        Schema::create('combos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('daily_price', 10, 2);
            $table->text('description');
        });

        Schema::create('combo_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('combo_id')->constrained('combos');
            $table->foreignId('product_id')->constrained('products');
            $table->integer('quantity');
        });

        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone', 50);
            $table->string('email');
        });

        Schema::create('import_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_id')->constrained('suppliers');
            $table->foreignId('admin_id')->constrained('users');
            $table->decimal('total_cost', 10, 2);
            $table->timestamp('import_date')->nullable();
        });

        Schema::create('import_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('import_order_id')->constrained('import_orders');
            $table->foreignId('product_id')->constrained('products');
            $table->integer('quantity')->nullable();
            $table->integer('cost_price')->nullable();
        });

        Schema::create('inventory', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('import_order_id')->constrained('import_orders');
            $table->enum('condition', ['NEW', 'GOOD', 'FAIR', 'DAMAGED']);
            $table->enum('status', [
                'AVAILABLE',
                'RENTING',
                'MAINTENACE',
                'LOST',
            ]);
            $table->string('serial_number', 100);
            $table->text('notes')->nullable();
            $table->timestamp('purchased_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
        });

        Schema::create('maintenance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_id')->constrained('inventory');
            $table->foreignId('staff_id')->constrained('users');
            $table->string('maintenance_name');
            $table->text('description');
            $table->decimal('cost', 10, 2);
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->enum('status', ['INVENTORY', 'MANTENMANCED']);
        });

        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code', 100)->unique();
            $table->decimal('discount_amount', 10, 2);
            $table->text('description')->nullable();
            $table->timestamp('valid_from')->nullable();
            $table->timestamp('valid_until')->nullable();
        });

        Schema::create('rentals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('coupon_id')->nullable()->constrained('coupons');
            $table->foreignId('address_id')->constrained('addresses');
            $table->string('code', 100)->unique();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->timestamp('actual_return_date')->nullable();
            $table->decimal('total_price', 10, 2);
            $table->decimal('deposit_amount', 10, 2);
            $table->enum('status', [
                'PENDING',
                'APPROVED',
                'DEPOSITED',
                'PICKED_UP',
                'COMPLETED',
                'CANCELLED',
            ]);
            $table->text('note')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });

        Schema::create('rental_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rental_id')->constrained('rentals');
            $table
                ->foreignId('product_id')
                ->nullable()
                ->constrained('products');
            $table->foreignId('combo_id')->nullable()->constrained('combos');
            $table
                ->foreignId('inventory_id')
                ->nullable()
                ->constrained('inventory');
            $table->integer('quantity');
            $table->decimal('price_at_rental', 10, 2);
        });

        Schema::create('rental_issues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rental_id')->constrained('rentals');
            $table
                ->foreignId('rental_detail_id')
                ->constrained('rental_details');
            $table->enum('type', ['LATE', 'DAMAGED', 'LOST']);
            $table->text('description');
            $table->decimal('penalty_fee', 10, 2);
            $table->enum('status', ['PENDING', 'RESOLVED']);
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rental_id')->constrained('rentals');
            $table->foreignId('user_id')->constrained('users');
            $table
                ->foreignId('issue_id')
                ->nullable()
                ->constrained('rental_issues');
            $table->enum('type', ['DEPOSIT', 'PAYMENT', 'REFUND', 'FINE']);
            $table->decimal('amount', 10, 2);
            $table->string('payment_method', 100);
            $table->enum('status', ['SUCCESS', 'FAILED', 'PENDING']);
            $table->string('transaction_ref')->nullable();
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('rental_id')->constrained('rentals');
            $table->integer('rating');
            $table->text('comment')->nullable();
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('return_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rental_id')->constrained('rentals');
            $table->timestamp('return_date')->nullable();
        });

        Schema::create('return_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('return_order_id')->constrained('return_orders');
            $table
                ->foreignId('rental_detail_id')
                ->constrained('rental_details');
            $table->enum('condition', ['GOOD', 'DAMAGED', 'LOST']);
            $table->text('note')->nullable();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->string('title');
            $table->text('content');
            $table->enum('type', ['ORDER', 'SYSTEM']);
            $table->boolean('is_read')->default(false);
            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('return_details');
        Schema::dropIfExists('return_orders');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('rental_issues');
        Schema::dropIfExists('rental_details');
        Schema::dropIfExists('rentals');
        Schema::dropIfExists('coupons');
        Schema::dropIfExists('maintenance_logs');
        Schema::dropIfExists('inventory');
        Schema::dropIfExists('import_details');
        Schema::dropIfExists('import_orders');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('combo_details');
        Schema::dropIfExists('combos');
        Schema::dropIfExists('product_img');
        Schema::dropIfExists('products');
        Schema::dropIfExists('rental_polices');
        Schema::dropIfExists('brands');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('role_has_permission');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('addresses');
        Schema::dropIfExists('user_info');
        Schema::dropIfExists('user_tokens');
        Schema::dropIfExists('users');
    }
};
