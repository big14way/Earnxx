#!/bin/bash

# EarnX Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 EarnX Docker Management Script${NC}"
echo "=================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop."
        exit 1
    fi
    print_status "Docker is running"
}

# Function to build and start services
start_services() {
    print_status "Starting EarnX services..."
    
    # Create directories if they don't exist
    mkdir -p ./docker
    
    # Build and start services
    docker-compose up --build -d
    
    print_status "Services started successfully!"
    print_status "API: http://localhost:3001"
    print_status "MongoDB: localhost:27017"
    
    # Wait for services to be healthy
    echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
    sleep 10
    
    # Check service health
    check_health
}

# Function to stop services
stop_services() {
    print_status "Stopping EarnX services..."
    docker-compose down
    print_status "Services stopped"
}

# Function to restart services
restart_services() {
    print_status "Restarting EarnX services..."
    docker-compose restart
    print_status "Services restarted"
}

# Function to check service health
check_health() {
    echo -e "${BLUE}🏥 Checking service health...${NC}"
    
    # Check API health
    if curl -f -s http://localhost:3001/health > /dev/null; then
        print_status "API is healthy"
    else
        print_warning "API health check failed"
    fi
    
    # Check MongoDB
    if docker exec earnx-mongodb mongo --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        print_status "MongoDB is healthy"
    else
        print_warning "MongoDB health check failed"
    fi
}

# Function to view logs
view_logs() {
    local service=${1:-earnx-api}
    print_status "Viewing logs for: $service"
    docker-compose logs -f "$service"
}

# Function to run tests
run_tests() {
    print_status "Running tests in Docker container..."
    docker-compose exec earnx-api npm test
}

# Function to access API container shell
shell_api() {
    print_status "Opening shell in API container..."
    docker-compose exec earnx-api sh
}

# Function to access MongoDB shell
shell_mongo() {
    print_status "Opening MongoDB shell..."
    docker-compose exec mongodb mongo earnx_verification
}

# Function to reset database
reset_database() {
    print_warning "This will delete all data in the database!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting database..."
        docker-compose exec mongodb mongo earnx_verification --eval "db.dropDatabase()"
        docker-compose restart mongodb
        print_status "Database reset complete"
    else
        print_status "Database reset cancelled"
    fi
}

# Function to show status
show_status() {
    echo -e "${BLUE}📊 Service Status:${NC}"
    docker-compose ps
    echo ""
    check_health
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_status "Cleanup complete"
}

# Main menu
case "${1:-}" in
    "start")
        check_docker
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "status")
        show_status
        ;;
    "logs")
        view_logs "${2:-earnx-api}"
        ;;
    "test")
        run_tests
        ;;
    "shell")
        shell_api
        ;;
    "mongo")
        shell_mongo
        ;;
    "reset-db")
        reset_database
        ;;
    "health")
        check_health
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|*)
        echo "Usage: $0 {start|stop|restart|status|logs|test|shell|mongo|reset-db|health|cleanup|help}"
        echo ""
        echo "Commands:"
        echo "  start     - Build and start all services"
        echo "  stop      - Stop all services"
        echo "  restart   - Restart all services"
        echo "  status    - Show service status and health"
        echo "  logs      - View service logs (default: earnx-api)"
        echo "  test      - Run tests in container"
        echo "  shell     - Open shell in API container"
        echo "  mongo     - Open MongoDB shell"
        echo "  reset-db  - Reset database (WARNING: deletes all data)"
        echo "  health    - Check service health"
        echo "  cleanup   - Stop services and clean up Docker resources"
        echo "  help      - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 start"
        echo "  $0 logs earnx-api"
        echo "  $0 logs mongodb"
        ;;
esac