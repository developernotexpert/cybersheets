---
name: Wfuzz
category: Web & Fuzzing
description: Web fuzzer for parameters, directories, auth and injection points.
tags: [wfuzz, fuzz, web, parameter, bruteforce, payload]
---

# Wfuzz

**Wfuzz** fuzzes web requests by replacing the `FUZZ` keyword with payloads. It predates ffuf and is a bit slower, but it's flexible: multiple payload markers, built-in encoders, and fine control over what counts as a hit.

> `apt install wfuzz` · `pip install wfuzz` · [github.com/xmendez/wfuzz](https://github.com/xmendez/wfuzz)

## Directory / file discovery

```bash
wfuzz -w wordlist.txt --hc 404 http://alvo/FUZZ
wfuzz -w wl.txt -z list,php-html-txt http://alvo/FUZZ.FUZ2Z   # two markers
```

## Filtering (the important part)

| Flag | Meaning |
|------|---------|
| `--hc` | Hide by status code (`--hc 404`) |
| `--sc` | Show only these status codes |
| `--hl / --hw / --hh` | Hide by lines / words / chars |
| `--sl / --sw / --sh` | Show by lines / words / chars |

```bash
wfuzz -w wl.txt --hc 404 --hw 42 http://alvo/FUZZ    # hide the boilerplate size
```

## Parameters, POST, headers, cookies

```bash
# GET parameter values
wfuzz -w values.txt --hc 404 'http://alvo/page?id=FUZZ'

# POST login brute (hide the failed-login size)
wfuzz -w users.txt -w pass.txt -d 'user=FUZZ&pass=FUZ2Z' \
  --hc 200 http://alvo/login

# Fuzz a header / cookie
wfuzz -w wl.txt -H 'X-Forwarded-For: FUZZ' http://alvo/
wfuzz -w wl.txt -b 'session=FUZZ' http://alvo/
```

## Payload sources (`-z`)

```bash
wfuzz -z range,1-1000 http://alvo/id/FUZZ            # numeric range
wfuzz -z file,wl.txt http://alvo/FUZZ
wfuzz -z list,admin-root-test http://alvo/FUZZ
# encoders: -z file,wl.txt,urlencode  /  ,base64  /  ,md5
```

## Output

```bash
wfuzz -w wl.txt --hc 404 -f out.txt http://alvo/FUZZ
wfuzz -w wl.txt --hc 404 -o json http://alvo/FUZZ > out.json
```

> Same idea as [ffuf](#/tool/ffuf) (which is faster) and [gobuster](#/tool/gobuster); Wfuzz wins on multi-payload logic and encoders. Route through [Burp](#/tool/burpsuite) with `-p 127.0.0.1:8080` to inspect what it sends.
