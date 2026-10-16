@echo off
cd /d "%~dp0"
py -3 corvus_scanner_gui.py
if errorlevel 1 pause
