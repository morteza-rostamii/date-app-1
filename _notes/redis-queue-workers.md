<!--

# setup redis on ubuntu

# assume docker is installed

docker pull redis:latest

sudo systemctl stop redis

docker stop redis-server
docker rm redis-server

docker run -d --name redis-server -p 6379:6379 redis:latest redis-server --requirepass 12345678

docker ps

# test
docker exec -it redis-server redis-cli
AUTH your_strong_password_here
PING
EXIT



 -->
