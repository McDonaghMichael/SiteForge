@echo off

echo Starting backend...
cd backend
start cmd /k "go run ."
cd ..

echo Starting frontend...
cd app
start cmd /k "npm start"
cd ..

echo Both backend and frontend are running!
pause
