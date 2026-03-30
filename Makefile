.PHONY: dev frontend backend

dev:
	(cd frontend && npm run dev) & \
	(cd backend && php artisan serve) & \
	wait

frontend:
	cd frontend && npm run dev

backend:
	cd backend && php artisan serve