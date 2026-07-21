---
name: SearchSploit
category: Exploitation
description: Offline search of the local Exploit-DB database.
tags: [exploit-db, exploit, offline, cve, poc]
---

# SearchSploit

**SearchSploit** is a command-line search tool for a **local copy** of Exploit-DB. It lets you find, read and copy public exploits/PoCs without an internet connection — ideal for offline labs and exams.

> `apt install exploitdb` · update the DB with `searchsploit -u` · [exploit-db.com](https://www.exploit-db.com)

## Searching

```bash
searchsploit apache 2.4
searchsploit windows smb remote
searchsploit -t oracle              # search title only (-t)
searchsploit "WordPress Core" 5.
searchsploit linux kernel 3.2 privilege escalation
```

## Refine results

| Option | Purpose |
|--------|---------|
| `-t` | Title only (fewer false positives) |
| `-e` | Exact match |
| `--exclude="term"` | Remove noise (e.g. `--exclude="PoC"`) |
| `-w` | Show Exploit-DB URLs |
| `-j` | JSON output |
| `--cve <id>` | Search by CVE |

```bash
searchsploit --cve 2017-0144
searchsploit apache --exclude="dos"
searchsploit -w openssh 7.
```

## Read & copy exploits

```bash
searchsploit -x 42315                       # view exploit by EDB-ID (or path)
searchsploit -p 42315                        # print full path + copy to clipboard
searchsploit -m 42315                        # mirror (copy) into current directory
searchsploit -m windows/remote/42315.py
```

## Keep it updated

```bash
searchsploit -u                              # update the local database
```

## Workflow

```bash
# 1) fingerprint versions with nmap
nmap -sV 10.0.0.5
# 2) look for matching public exploits
searchsploit vsftpd 2.3.4
# 3) copy locally and read before running
searchsploit -m unix/remote/49757.py
```

> Always **read the exploit source** before executing — verify targets/offsets and that it isn't malicious. Complements [msfconsole](#/tool/msfconsole); many EDB entries are also available as Metasploit modules.
