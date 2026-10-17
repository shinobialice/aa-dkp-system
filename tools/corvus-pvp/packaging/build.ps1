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
# Pin the Npcap installer the setup offers to download: this also checks that
# the URL in CorvusScanner.iss still works.
$npcapUrl = (Select-String -Path packaging\CorvusScanner.iss -Pattern '#define NpcapUrl "(.+)"').Matches[0].Groups[1].Value
$npcapSha = ""
try {
  Invoke-WebRequest $npcapUrl -OutFile build\npcap-setup.exe -UseBasicParsing
  $npcapSha = (Get-FileHash build\npcap-setup.exe -Algorithm SHA256).Hash.ToLower()
  Write-Host "Npcap installer $npcapUrl sha256 $npcapSha"
} catch {
  if ($env:GITHUB_ACTIONS) { throw "Npcap URL $npcapUrl is broken ($_): update NpcapUrl in CorvusScanner.iss" }
  Write-Warning "Could not download $npcapUrl ($_); the setup will not verify its hash"
}
& $iscc "/DAppVersion=$Version" "/DNpcapSha256=$npcapSha" packaging\CorvusScanner.iss
if ($LASTEXITCODE -ne 0) { throw "Inno Setup failed" }
Get-Item packaging\Output\CorvusScannerSetup.exe
