Write-Host "Installing Python dependencies for Recipe Scraper..." -ForegroundColor Green
Write-Host ""

Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "Found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python from https://python.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Installing required packages..." -ForegroundColor Yellow
Write-Host ""

$packages = @("requests", "beautifulsoup4", "supabase", "python-dotenv", "lxml")

foreach ($package in $packages) {
    Write-Host "Installing $package..." -ForegroundColor Cyan
    try {
        pip install $package
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Trying with pip3..." -ForegroundColor Yellow
            pip3 install $package
        }
        Write-Host "✅ $package installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install $package" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Testing installation..." -ForegroundColor Yellow
try {
    python -c "import requests, bs4, supabase; print('✅ All packages installed successfully!')"
    Write-Host ""
    Write-Host "✅ Installation complete! You can now run:" -ForegroundColor Green
    Write-Host "python recipe_scraper_gui.py" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Some packages failed to install" -ForegroundColor Red
    Write-Host "Try running PowerShell as administrator" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"
