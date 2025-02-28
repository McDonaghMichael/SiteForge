@echo off

echo Installing Go dependencies...
cd backend
go mod tidy
cd ..

echo Installing frontend dependencies...
cd app
npm install
cd ..

echo Done!
pause
