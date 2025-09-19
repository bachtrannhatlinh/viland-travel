@echo off
echo.
echo ====================================
echo   ViLand Travel Docker Mode Switcher
echo ====================================
echo.
echo Choose mode:
echo 1. LOCAL server (with database)
echo 2. PRODUCTION server (via proxy - no CORS issues)
echo 3. PRODUCTION server (direct - may have CORS issues)
echo 4. PRODUCTION server (via .env direct)
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo 🔧 Switching to LOCAL mode...
    echo NEXT_PUBLIC_API_URL=http://localhost:5000 > .env
    docker compose down
    docker compose up --build -d
    echo ✅ LOCAL mode activated!
    echo Frontend: http://localhost:3000
    echo Admin: http://localhost:4000
    echo API: http://localhost:5000
) else if "%choice%"=="2" (
    echo.
    echo 🌐 Switching to PRODUCTION mode (via .env proxy)...
    echo NEXT_PUBLIC_API_URL=http://localhost:3000/api/proxy > .env
    docker compose down
    docker compose build --no-cache web-user web-admin
    docker compose up -d
    echo ✅ PRODUCTION mode activated!
    echo Frontend: http://localhost:3000 (using production API via proxy)
    echo Admin: http://localhost:4000 (using production API via proxy)
) else if "%choice%"=="3" (
    echo.
    echo 🌐 Switching to PRODUCTION mode (direct connection)...
    docker compose down
    docker compose -f docker-compose.production.yml up --build -d
    echo ✅ PRODUCTION mode activated!
    echo Frontend: http://localhost:3000 (direct to production API)
    echo Admin: http://localhost:4000 (direct to production API)
    echo ⚠️ Note: May encounter CORS issues. Disable CORS in browser if needed.
) else if "%choice%"=="4" (
    echo.
    echo 🌐 Switching to PRODUCTION mode (via .env direct)...
    echo NEXT_PUBLIC_API_URL=https://viland-travel-production.up.railway.app > .env
    docker compose down
    docker compose build --no-cache web-user web-admin
    docker compose up -d
    echo ✅ PRODUCTION mode activated!
    echo Frontend: http://localhost:3000 (direct to production API)
    echo Admin: http://localhost:4000 (direct to production API)
    echo ⚠️ Note: May encounter CORS issues. Disable CORS in browser if needed.
) else if "%choice%"=="5" (
    echo Goodbye!
    exit
) else (
    echo Invalid choice!
    pause
)

echo.
echo Press any key to close...
pause > nul
