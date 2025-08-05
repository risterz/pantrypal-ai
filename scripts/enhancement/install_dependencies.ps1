# PowerShell script to install dependencies for PantryPal Enhancement Cleaner

Write-Host "Installing dependencies for PantryPal Enhancement Cleaner..." -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ $pythonVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python from https://python.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Installing required packages..." -ForegroundColor Cyan
Write-Host ""

# Install required packages
try {
    Write-Host "Installing supabase..." -ForegroundColor Yellow
    pip install supabase
    
    Write-Host "Installing python-dotenv..." -ForegroundColor Yellow
    pip install python-dotenv
    
    Write-Host ""
    Write-Host "✅ All dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run the Enhancement Cleaner tool with:" -ForegroundColor Cyan
    Write-Host "python enhancement_cleaner_gui.py" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "❌ ERROR: Failed to install some packages" -ForegroundColor Red
    Write-Host "Please check your internet connection and try again" -ForegroundColor Yellow
    Write-Host "Error details: $($_.Exception.Message)" -ForegroundColor Red
}

Read-Host "Press Enter to continue"
