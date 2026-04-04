FROM php:8.2-cli

WORKDIR /app

# Install extensions
RUN docker-php-ext-install pdo pdo_mysql

# Copy code
COPY . .

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Expose port
EXPOSE 8000

# Run Laravel
CMD php artisan serve --host=0.0.0.0 --port=$PORT