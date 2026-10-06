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
ffuf -w wordlist.txt -u https://target.com/FUZZ
ffuf -w wordlist.txt -u https://target.com/FUZZ -e .php,.html,.txt   # extensions
ffuf -w wordlist.txt -u https://target.com/FUZZ -recursion -recursion-depth 2
ffuf -w wordlist.txt -u https://target.com/FUZZ -c -v                # color + full URLs
```

## Filtering & matching responses

| Flag | Meaning |
|------|---------|
| `-mc` | Match status codes (`-mc 200,301,403`; `all` matches everything) |
| `-ms` | Match response size |
| `-mw` | Match word count |
| `-ml` | Match line count |
| `-mr` | Match regex in response |
| `-fc` | Filter out status codes |
| `-fs` | Filter by response size |
| `-fw` | Filter by word count |
| `-fl` | Filter by line count |
| `-fr` | Filter by regex |
| `-ac` | Auto-calibrate filters from sample requests |

```bash
ffuf -w wl.txt -u https://target.com/FUZZ -mc 200,204,301,302,307,401,403
ffuf -w wl.txt -u https://target.com/FUZZ -fs 4242      # hide the "not found" body size
ffuf -w wl.txt -u https://target.com/FUZZ -fw 12        # hide by word count
ffuf -w wl.txt -u https://target.com/FUZZ -ac           # auto-calibrate (start here)
```

## Virtual host discovery

```bash
# -fs 0 hides empty responses; calibrate against a known-bad vhost to set the real filter
ffuf -w vhosts.txt -u https://target.com/ -H "Host: FUZZ.target.com" -fs 0
```

## Parameter fuzzing

```bash
# GET parameter names
ffuf -w params.txt -u 'https://target.com/page?FUZZ=1' -fs 1234
# Parameter values
ffuf -w values.txt -u 'https://target.com/page?id=FUZZ'
# POST body
ffuf -w wl.txt -u https://target.com/login -X POST \
  -d 'user=admin&pass=FUZZ' -H 'Content-Type: application/x-www-form-urlencoded' -fc 200
# JSON body
ffuf -w wl.txt -u https://target.com/api -X POST \
  -H 'Content-Type: application/json' -d '{"user":"admin","pass":"FUZZ"}' -mc 200
```

## Multiple wordlists

```bash
# clusterbomb (default): every combination of the two lists
ffuf -w users.txt:U -w pass.txt:P -u https://target.com/login \
  -X POST -d 'user=U&pass=P' -fc 200
# pitchfork: lists advance in lockstep (line 1 with line 1, ...)
ffuf -w users.txt:U -w pass.txt:P -mode pitchfork -u 'https://target.com/?u=U&p=P'
```

## Replay a Burp request

```bash
# Save a request from Burp ("Copy to file"), mark FUZZ, and replay it
ffuf -request req.txt -request-proto https -w wl.txt -mc 200
```

## Performance & output

```bash
ffuf -w wl.txt -u https://target.com/FUZZ -t 200          # 200 threads
ffuf -w wl.txt -u https://target.com/FUZZ -rate 500       # cap requests/sec
ffuf -w wl.txt -u https://target.com/FUZZ -p 0.1          # delay between requests
ffuf -w wl.txt -u https://target.com/FUZZ -x http://127.0.0.1:8080   # proxy through Burp
ffuf -w wl.txt -u https://target.com/FUZZ -H "Cookie: session=..."
ffuf -w wl.txt -u https://target.com/FUZZ -o out.json -of json       # json/html/csv/md/all
ffuf -w wl.txt -u https://target.com/FUZZ -s                         # silent, results only
ffuf -w wl.txt -u https://target.com/FUZZ -ic                        # ignore wordlist comments
```

> Start with `-ac` (or a measured `-fs`/`-fw`) to avoid drowning in false positives. Good wordlists: SecLists (`raft-*`, `directory-list-*`). Use `-rate`/`-p` to stay gentle and in scope. Alternatives: [gobuster](#/tool/gobuster), [dirb](#/tool/dirb).
