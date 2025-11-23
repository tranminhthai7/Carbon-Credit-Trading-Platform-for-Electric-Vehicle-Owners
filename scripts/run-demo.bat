@echo off
REM Simple Windows batch wrapper to run the PS1 with bypass executionpolicy
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0\run-demo.ps1" %*
