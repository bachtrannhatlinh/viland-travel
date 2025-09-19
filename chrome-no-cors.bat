@echo off
echo Closing all Chrome instances...
taskkill /f /im chrome.exe >nul 2>&1

echo Starting Chrome with CORS disabled...
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:/temp/chrome-cors-disabled" http://localhost:3000

echo Chrome started with CORS disabled for testing!
pause
