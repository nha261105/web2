FROM php:8.2-cli

WORKDIR /app

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    && docker-php-ext-install zip pdo pdo_mysql

# Copy code
COPY . .

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Expose port
EXPOSE 8000

# Run Laravel
CMD php artisan serve --host=0.0.0.0 --port=$PORT