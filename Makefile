.PHONE: dev frontend backend

dev:
	$(NAME) -j2 frontend backend

frontend:
	cd frontend && npm run dev

backend:
	cd backend && php artisan serve