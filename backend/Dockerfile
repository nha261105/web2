FROM php:8.2-apache

RUN docker-php-ext-install mysqli pdo pdo_mysql

RUN a2dismod mpm_event mpm_worker || true
RUN a2enmod mpm_prefork

RUN a2enmod rewrite

COPY . /var/www/html/

WORKDIR /var/www/html/