@echo off
cd /d "%~dp0"
set PORT=5500
python -m http.server %PORT% 2>nul
if %ERRORLEVEL% EQU 0 goto end
if exist "%~dp0serve.js" (
  node "%~dp0serve.js"
  if %ERRORLEVEL% EQU 0 goto end
)
 echo Neither Python nor Node.js start script is available.
 echo Install Python or Node.js, then run "start-local-server.bat" again.
:end
