---
name: SecLists
category: Web & Fuzzing
description: The collection of wordlists — dirs, DNS, usernames, passwords, fuzzing payloads.
tags: [seclists, wordlists, fuzzing, passwords, usernames, dns, payloads, rockyou]
---

# SecLists

**SecLists** is the go-to collection of security wordlists — the fuel for almost every brute-force and fuzzing tool. It bundles directory/file names, DNS subdomains, usernames, passwords, and injection payloads (SQLi, XSS, LFI, command injection) in one tree. It's not a tool you run; it's the input you point [ffuf](#/tool/ffuf), [gobuster](#/tool/gobuster), [hydra](#/tool/hydra) and [hashcat](#/tool/hashcat) at.

> `apt install seclists` → `/usr/share/seclists` · `git clone https://github.com/danielmiessler/SecLists` · [github.com/danielmiessler/SecLists](https://github.com/danielmiessler/SecLists)

```bash
# Examples below assume this base path (Kali default)
export SL=/usr/share/seclists
```

## Layout

| Folder | What's inside |
|--------|---------------|
| `Discovery/Web-Content/` | Directory & file names for dir busting |
| `Discovery/DNS/` | Subdomain wordlists |
| `Discovery/Infrastructure/` | Ports, SNMP, etc. |
| `Usernames/` | Username lists |
| `Passwords/` | Password lists (incl. rockyou, leaked DBs) |
| `Fuzzing/` | Injection payloads (SQLi, XSS, LFI, SSTI…) |
| `Payloads/` | Ready-made files, zip-slip, polyglots |
| `Pattern-Matching/` | grep patterns for loot (keys, secrets) |
| `Web-Shells/` | Web shells by language |

Find a list fast:

```bash
ls $SL/Discovery/Web-Content/ | less
find $SL -iname '*subdomain*'          # locate by keyword
wc -l $SL/Discovery/Web-Content/common.txt   # check size before launching
```

## Web content (directories & files)

| List | Size | When |
|------|------|------|
| `Discovery/Web-Content/common.txt` | ~4.7k | Quick first pass |
| `Discovery/Web-Content/raft-medium-directories.txt` | ~30k | Balanced dir scan |
| `Discovery/Web-Content/raft-large-words.txt` | ~120k | Thorough |
| `Discovery/Web-Content/directory-list-2.3-medium.txt` | ~220k | Classic deep scan |
| `Discovery/Web-Content/api/api-endpoints.txt` | — | REST/API routes |

```bash
# Quick pass, then go deeper only if needed
ffuf -w $SL/Discovery/Web-Content/common.txt -u https://target.com/FUZZ -ac
gobuster dir -u https://target.com -w $SL/Discovery/Web-Content/raft-medium-directories.txt \
  -x php,txt,bak -k
```

## DNS (subdomains)

| List | Size |
|------|------|
| `Discovery/DNS/subdomains-top1million-5000.txt` | 5k (fast) |
| `Discovery/DNS/subdomains-top1million-110000.txt` | 110k (deep) |
| `Discovery/DNS/dns-Jhaddix.txt` | huge, exhaustive |

```bash
gobuster dns -d example.com -w $SL/Discovery/DNS/subdomains-top1million-5000.txt
ffuf -w $SL/Discovery/DNS/subdomains-top1million-110000.txt \
  -u https://target.com/ -H "Host: FUZZ.example.com" -fs 0      # vhost fuzzing
```

## Usernames

| List | Use |
|------|-----|
| `Usernames/top-usernames-shortlist.txt` | 17 common accounts — fast |
| `Usernames/xato-net-10-million-usernames.txt` | Broad real-world list |
| `Usernames/Names/names.txt` | First/last names |

## Passwords

| List | Use |
|------|-----|
| `Passwords/Common-Credentials/10-million-password-list-top-1000.txt` | Fast online spray |
| `Passwords/Common-Credentials/10-million-password-list-top-100000.txt` | Bigger online list |
| `Passwords/Leaked-Databases/rockyou.txt.tar.gz` | The classic — **extract first** |
| `Passwords/Default-Credentials/default-passwords.csv` | Vendor defaults |

```bash
# rockyou ships compressed — unpack it once
tar -xzf $SL/Passwords/Leaked-Databases/rockyou.txt.tar.gz -C /tmp/
# On Kali it's also at /usr/share/wordlists/rockyou.txt.gz → gunzip -k it

# Online brute-force (one service, authorized targets only)
hydra -L $SL/Usernames/top-usernames-shortlist.txt \
      -P $SL/Passwords/Common-Credentials/10-million-password-list-top-1000.txt \
      ssh://target.com

# Offline hash cracking
hashcat -m 0 hashes.txt /tmp/rockyou.txt            # MD5 + rockyou
john --wordlist=/tmp/rockyou.txt hashes.txt
```

## Fuzzing payloads

| List | For |
|------|-----|
| `Fuzzing/SQLi/Generic-SQLi.txt` | SQL injection |
| `Fuzzing/XSS/XSS-Jhaddix.txt` | Cross-site scripting |
| `Fuzzing/LFI/LFI-Jhaddix.txt` | Local file inclusion |
| `Fuzzing/big-list-of-naughty-strings.txt` | Break input validation |
| `Fuzzing/command-injection-commix.txt` | Command injection |

```bash
# Fuzz a parameter with SQLi payloads, flag responses that look different
ffuf -w $SL/Fuzzing/SQLi/Generic-SQLi.txt -u 'https://target.com/item?id=FUZZ' -mr 'SQL|error|syntax'
# Test an LFI-prone parameter
ffuf -w $SL/Fuzzing/LFI/LFI-Jhaddix.txt -u 'https://target.com/?page=FUZZ' -mr 'root:.*:0:0:'
```

## Tips

```bash
# Build a custom list: merge, dedupe, sort by length
cat list1.txt list2.txt | sort -u > custom.txt
awk '{ print length, $0 }' custom.txt | sort -n | cut -d' ' -f2- > by-length.txt

# Trim a giant list to a sane size for a first pass
head -n 20000 $SL/Discovery/Web-Content/directory-list-2.3-medium.txt > quick.txt
```

> Pick the **smallest list that fits the job** and go bigger only when a pass comes up empty — a 220k list across many extensions is a lot of requests. Pair with [cewl](#/tool/cewl) to generate target-specific words. Online brute-forcing is noisy and locks accounts: keep it slow and strictly in scope.
