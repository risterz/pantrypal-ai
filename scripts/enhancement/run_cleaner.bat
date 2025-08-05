@echo off
echo Starting PantryPal Enhancement Cleaner...
echo.

REM Check if Python is available
py --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please run install_dependencies.bat first
    pause
    exit /b 1
)

REM Run the enhancement cleaner
py enhancement_cleaner_gui.py

if errorlevel 1 (
    echo.
    echo ERROR: Failed to run the enhancement cleaner
    echo Make sure you have installed the dependencies with install_dependencies.bat
    pause
)
