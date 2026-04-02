@echo off
echo ==========================================
echo SideX Release Build Script
echo ==========================================

:: Set high memory limits
set NODE_OPTIONS=--max-old-space-size=14336

:: Step 1: Build frontend with Vite
echo [1/3] Building frontend with Vite...
node node_modules/vite/bin/vite.js build
if %ERRORLEVEL% neq 0 (
  echo Frontend build failed!
  exit /b 1
)

:: Step 2: Copy extensions
echo [2/3] Copying extensions...
node -e "const fs=require('fs'); if(fs.existsSync('extensions')){fs.cpSync('extensions','dist/extensions',{recursive:true,force:true});} if(fs.existsSync('extensions-meta.json')){fs.copyFileSync('extensions-meta.json','dist/extensions-meta.json');} console.log('Copied extensions');"

:: Step 3: Build Tauri
echo [3/3] Building Tauri release...
cd src-tauri
cargo tauri build --release
if %ERRORLEVEL% neq 0 (
  echo Tauri build failed!
  exit /b 1
)

echo ==========================================
echo Build complete!
echo ==========================================
