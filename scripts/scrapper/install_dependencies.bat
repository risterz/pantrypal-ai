@echo off
echo Installing Python dependencies for Recipe Scraper...
echo.

echo Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

echo.
echo Installing required packages...
echo.

echo Installing requests...
pip install requests
if %errorlevel% neq 0 (
    echo Trying with pip3...
    pip3 install requests
)

echo Installing beautifulsoup4...
pip install beautifulsoup4
if %errorlevel% neq 0 (
    echo Trying with pip3...
    pip3 install beautifulsoup4
)

echo Installing supabase...
pip install supabase
if %errorlevel% neq 0 (
    echo Trying with pip3...
    pip3 install supabase
)

echo Installing python-dotenv...
pip install python-dotenv
if %errorlevel% neq 0 (
    echo Trying with pip3...
    pip3 install python-dotenv
)

echo Installing lxml (for better HTML parsing)...
pip install lxml
if %errorlevel% neq 0 (
    echo Trying with pip3...
    pip3 install lxml
)

echo.
echo Testing installation...
python -c "import requests, bs4, supabase; print('✅ All packages installed successfully!')"
if %errorlevel% neq 0 (
    echo ❌ Some packages failed to install
    echo Try running this script as administrator
    pause
    exit /b 1
)

echo.
echo ✅ Installation complete! You can now run:
echo python recipe_scraper_gui.py
echo.
pause
