# Builds CorvusScannerSetup.exe on Windows (also used by GitHub Actions).
#   cd tools\corvus-pvp
#   .\packaging\build.ps1 -Version 1.0.1
# Needs Python 3.10+ in PATH; installs PyInstaller and Pillow into it, and
# Inno Setup 6 through Chocolatey if ISCC.exe is missing.
param([string]$Version = "1.0.0")
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

python -m pip install --quiet --upgrade pyinstaller pillow
python packaging\make_icons.py ..\..\public\images\logo.png build

python -m PyInstaller --noconfirm --clean --windowed --uac-admin `
  --name CorvusScanner --icon build\corvus.ico `
  --add-data "aa_class_names.json;." --add-data "build\corvus.png;." `
  --paths . corvus_scanner_gui.py
if ($LASTEXITCODE -ne 0) { throw "PyInstaller failed" }

$iscc = "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe"
if (-not (Test-Path $iscc)) {
  choco install innosetup --yes --no-progress
  if ($LASTEXITCODE -ne 0) { throw "Inno Setup install failed" }
}
& $iscc "/DAppVersion=$Version" packaging\CorvusScanner.iss
if ($LASTEXITCODE -ne 0) { throw "Inno Setup failed" }
Get-Item packaging\Output\CorvusScannerSetup.exe
