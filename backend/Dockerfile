FROM php:8.2-apache

RUN docker-php-ext-install mysqli pdo pdo_mysql

RUN a2enmod rewrite

# Copy code
COPY . /var/www/html/

WORKDIR /var/www/html/

EXPOSE 80