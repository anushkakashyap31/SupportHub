.PHONY: up down build logs ps clean help

up:
	docker compose up -d
	@echo "SupportHub is running!"
	@echo "Platform  : http://localhost"
	@echo "TriageAgent: http://localhost/triage/"
	@echo "QuizBot   : http://localhost/quiz/"

down:
	docker compose down
	@echo "SupportHub stopped."

build:
	docker compose build --no-cache

logs:
	docker compose logs -f

ps:
	docker compose ps

clean:
	docker compose down -v --rmi all
	@echo "All containers and images removed."

restart:
	docker compose down
	docker compose up -d

help:
	@echo "SupportHub Commands:"
	@echo "  make up       - Start all services"
	@echo "  make down     - Stop all services"
	@echo "  make build    - Rebuild all images"
	@echo "  make logs     - View live logs"
	@echo "  make ps       - See container status"
	@echo "  make clean    - Remove everything"
	@echo "  make restart  - Restart all services"