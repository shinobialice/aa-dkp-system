; Inno Setup script: installer for the Corvus PvP scanner (built by build.ps1).
; The program needs no Python (PyInstaller build).  It captures with Npcap when
; installed, otherwise with the built-in Windows raw socket (needs admin rights,
; so it always runs as administrator).  Setup offers to download Npcap.

#ifndef AppVersion
  #define AppVersion "1.0.0"
#endif
#ifndef NpcapSha256
  #define NpcapSha256 ""
#endif
#define NpcapUrl "https://npcap.com/dist/npcap-1.88.exe"
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
; Shown only when Npcap is missing. The official installer is downloaded from
; npcap.com (Npcap may not be bundled) and opens its own wizard.
Name: "npcap"; Description: "Установить Npcap — захват надёжнее (скачается с npcap.com, откроется его установщик)"; GroupDescription: "Захват пакетов:"; Check: not NpcapInstalled

[Files]
Source: "..\dist\CorvusScanner\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#AppName}"; Filename: "{app}\{#AppExe}"
Name: "{group}\Удалить {#AppName}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#AppName}"; Filename: "{app}\{#AppExe}"; Tasks: desktopicon

[Run]
Filename: "{tmp}\npcap-setup.exe"; Parameters: "/winpcap_mode=yes"; StatusMsg: "Установка Npcap…"; Tasks: npcap; Flags: waituntilterminated skipifdoesntexist
; Windows Firewall hides incoming packets from raw sockets of programs it does not allow.
Filename: "{sys}\netsh.exe"; Parameters: "advfirewall firewall delete rule name=""{#FirewallRule}"""; Flags: runhidden
Filename: "{sys}\netsh.exe"; Parameters: "advfirewall firewall add rule name=""{#FirewallRule}"" dir=in action=allow program=""{app}\{#AppExe}"" enable=yes"; Flags: runhidden
Filename: "{app}\{#AppExe}"; Description: "Запустить сканер"; Flags: nowait postinstall skipifsilent shellexec

[UninstallRun]
Filename: "{sys}\netsh.exe"; Parameters: "advfirewall firewall delete rule name=""{#FirewallRule}"""; Flags: runhidden; RunOnceId: "RemoveFirewallRule"

[Code]
var
  DownloadPage: TDownloadWizardPage;

function NpcapInstalled: Boolean;
begin
  Result := FileExists(ExpandConstant('{sys}\Npcap\wpcap.dll'));
end;

procedure InitializeWizard;
begin
  DownloadPage := CreateDownloadPage(SetupMessage(msgWizardPreparing), 'Скачивание Npcap с npcap.com…', nil);
end;

function NextButtonClick(CurPageID: Integer): Boolean;
begin
  Result := True;
  if (CurPageID = wpReady) and WizardIsTaskSelected('npcap') then
  begin
    DownloadPage.Clear;
    DownloadPage.Add('{#NpcapUrl}', 'npcap-setup.exe', '{#NpcapSha256}');
    DownloadPage.Show;
    try
      try
        DownloadPage.Download;
      except
        if not DownloadPage.AbortedByUser then
          SuppressibleMsgBox('Не удалось скачать Npcap: ' + GetExceptionMessage + #13#10#13#10 +
            'Сканер будет работать и без него (встроенный захват Windows). ' +
            'Npcap можно поставить позже с сайта npcap.com.', mbInformation, MB_OK, IDOK);
      end;
    finally
      DownloadPage.Hide;
    end;
  end;
end;
