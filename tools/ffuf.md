---
name: ffuf
category: Web & Fuzzing
description: Fast Go web fuzzer for directories, parameters, headers and vhosts.
tags: [fuzz, web, directory, vhost, parameter, go]
---

# ffuf

**ffuf** (Fuzz Faster U Fool) is a high-performance web fuzzer written in Go. The `FUZZ` keyword marks where wordlist entries are injected — use it to discover directories, files, parameters, headers and virtual hosts.

> `apt install ffuf` · `go install github.com/ffuf/ffuf/v2@latest` · [github.com/ffuf/ffuf](https://github.com/ffuf/ffuf)

## Directory / file discovery

```bash
ffuf -w wordlist.txt -u https://alvo/FUZZ
ffuf -w wordlist.txt -u https://alvo/FUZZ -e .php,.html,.txt   # extensions
ffuf -w wordlist.txt -u https://alvo/FUZZ -recursion -recursion-depth 2
```

## Filtering & matching responses

| Flag | Meaning |
|------|---------|
| `-mc` | Match status codes (`-mc 200,301,403`) |
| `-fc` | Filter out status codes |
| `-fs` | Filter by response size |
| `-fw` | Filter by word count |
| `-fl` | Filter by line count |
| `-ac` | Auto-calibrate filtering |

```bash
ffuf -w wl.txt -u https://alvo/FUZZ -mc 200,204,301,302,307,401,403
ffuf -w wl.txt -u https://alvo/FUZZ -fs 4242         # hide the "not found" size
ffuf -w wl.txt -u https://alvo/FUZZ -ac              # auto-calibrate
```

## Virtual host discovery

```bash
ffuf -w vhosts.txt -u https://alvo/ -H "Host: FUZZ.alvo.com" -fs 0
```

## Parameter fuzzing

```bash
# GET parameters
ffuf -w params.txt -u 'https://alvo/page?FUZZ=1' -fs 1234
# Parameter values
ffuf -w values.txt -u 'https://alvo/page?id=FUZZ'
# POST body
ffuf -w wl.txt -u https://alvo/login -X POST \
  -d 'user=admin&pass=FUZZ' -H 'Content-Type: application/x-www-form-urlencoded' -fc 200
```

## Performance & output

```bash
ffuf -w wl.txt -u https://alvo/FUZZ -t 200           # 200 threads
ffuf -w wl.txt -u https://alvo/FUZZ -rate 500        # cap requests/sec
ffuf -w wl.txt -u https://alvo/FUZZ -o out.json -of json
ffuf -w wl.txt -u https://alvo/FUZZ -H "Cookie: session=..." -b "session=..."
```

## Multiple wordlists

```bash
ffuf -w users.txt:U -w pass.txt:P -u https://alvo/login \
  -X POST -d 'user=U&pass=P' -fc 200
```

> Start with `-ac` to avoid drowning in false positives. Good wordlists: SecLists (`raft-*`, `directory-list-*`). Alternatives: [gobuster](#/tool/gobuster), [dirb](#/tool/dirb).
