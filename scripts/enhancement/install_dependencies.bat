@echo off
echo Installing dependencies for PantryPal Enhancement Cleaner...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

echo Python found. Installing required packages...
echo.

REM Install required packages
pip install supabase python-dotenv

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install some packages
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

echo.
echo ✅ All dependencies installed successfully!
echo.
echo You can now run the Enhancement Cleaner tool with:
echo python enhancement_cleaner_gui.py
echo.
pause
