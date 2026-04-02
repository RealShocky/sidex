@echo off
set NODE_OPTIONS=--max-old-space-size=14336
set VITE_NODE_OPTIONS=--max-old-space-size=14336
echo Building with 14GB memory limit...
node node_modules/vite/bin/vite.js build
if %ERRORLEVEL% neq 0 (
  echo Build failed with error %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)
echo Running postbuild...
node -e "const fs=require('fs'); if(fs.existsSync('extensions')){fs.cpSync('extensions','dist/extensions',{recursive:true,force:true});} if(fs.existsSync('extensions-meta.json')){fs.copyFileSync('extensions-meta.json','dist/extensions-meta.json');} console.log('Post-build: copied extensions');"
echo Build complete!
