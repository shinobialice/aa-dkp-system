; Inno Setup script: installer for the Corvus PvP scanner (built by build.ps1).
; The program needs no Python and no Npcap: it is a PyInstaller build that
; captures through the built-in Windows raw socket, so it runs as administrator.

#ifndef AppVersion
  #define AppVersion "1.0.0"
#endif
#define AppName "Corvus PvP Scanner"
#define AppExe "CorvusScanner.exe"
#define FirewallRule "Corvus PvP Scanner"

[Setup]
AppId={{6E0D8A5B-3C2F-4C1E-9B6A-2F8F7C5D1A40}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher=No Fear
DefaultDirName={autopf}\CorvusScanner
DefaultGroupName={#AppName}
DisableProgramGroupPage=yes
OutputDir=Output
OutputBaseFilename=CorvusScannerSetup
SetupIconFile=..\build\corvus.ico
UninstallDisplayIcon={app}\{#AppExe}
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
CloseApplications=yes

[Languages]
Name: "russian"; MessagesFile: "compiler:Languages\Russian.isl"

[Tasks]
Name: "desktopicon"; Description: "Создать ярлык на рабочем столе"; GroupDescription: "Ярлыки:"

[Files]
Source: "..\dist\CorvusScanner\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#AppName}"; Filename: "{app}\{#AppExe}"
Name: "{group}\Удалить {#AppName}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#AppName}"; Filename: "{app}\{#AppExe}"; Tasks: desktopicon

[Run]
; Windows Firewall hides incoming packets from raw sockets of programs it does not allow.
Filename: "{sys}\netsh.exe"; Parameters: "advfirewall firewall delete rule name=""{#FirewallRule}"""; Flags: runhidden
Filename: "{sys}\netsh.exe"; Parameters: "advfirewall firewall add rule name=""{#FirewallRule}"" dir=in action=allow program=""{app}\{#AppExe}"" enable=yes"; Flags: runhidden
Filename: "{app}\{#AppExe}"; Description: "Запустить сканер"; Flags: nowait postinstall skipifsilent shellexec

[UninstallRun]
Filename: "{sys}\netsh.exe"; Parameters: "advfirewall firewall delete rule name=""{#FirewallRule}"""; Flags: runhidden; RunOnceId: "RemoveFirewallRule"
