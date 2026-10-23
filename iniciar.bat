@echo off
echo Instalando (solo la primera vez, puede tardar unos minutos)...
if not exist node_modules call npm install
echo.
echo Abriendo la tienda en http://localhost:5173
start http://localhost:5173
call npm run dev
pause
