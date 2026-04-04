FROM php:8.2-apache

RUN rm -f /etc/apache2/mods-enabled/mpm_*.load

RUN a2enmod mpm_prefork

RUN a2enmod rewrite

RUN docker-php-ext-install mysqli pdo pdo_mysql

COPY . /var/www/html/
WORKDIR /var/www/html/