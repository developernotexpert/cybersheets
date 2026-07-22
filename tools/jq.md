---
name: jq
category: Utilities & Shell
description: Command-line JSON processor — filter, transform and extract.
tags: [jq, json, parse, api, filter, shell]
---

# jq

**jq** slices and reshapes JSON on the command line. Paired with [curl](#/tool/curl), it turns noisy API responses into exactly the fields you want — essential for working with modern tools and REST APIs.

> `apt install jq` · `brew install jq` · [jqlang.github.io/jq](https://jqlang.github.io/jq/)

## Basics

```bash
jq . data.json                        # pretty-print
curl -s https://api/x | jq .           # pretty-print a response
jq '.name' data.json                   # one field
jq '.user.email' data.json             # nested field
jq -r '.name' data.json                # raw output (no quotes) — good for scripts
```

## Arrays

```bash
jq '.[]' data.json                    # each element
jq '.items[].id' data.json            # a field from each element
jq '.[0]' data.json                    # first element
jq 'length' data.json                  # array/object size
jq -r '.[].name' data.json | sort -u   # unique names, script-friendly
```

## Filter, map, select

```bash
jq '.[] | select(.active == true)' data.json
jq '.[] | select(.port == 443) | .host' scan.json
jq '.users[] | {name, email}' data.json          # reshape objects
jq '[.[] | .ip] | unique' data.json               # collect + dedupe
jq 'map(.price) | add' data.json                   # sum a field
```

## Real-world combos

```bash
# subfinder/httpx JSON -> just live URLs
httpx -json -l hosts.txt | jq -r 'select(.status_code==200) | .url'

# nmap-to-json tools, shodan, etc.
shodan parse --fields ip_str,port scan.json.gz     # (shodan has its own)
curl -s 'https://api.github.com/users/USER/keys' | jq -r '.[].key'

# build a request body
jq -n --arg u admin '{user:$u, role:"admin"}'
```

## Options

```bash
jq -c '.' data.json                   # compact (one line, good for pipelines)
jq -s '.' a.json b.json                # slurp multiple files into one array
jq 'keys' data.json                    # list an object's keys
```

> The companion to [curl](#/tool/curl) for anything JSON. `-r` (raw) is what makes output usable in shell loops. For non-JSON text, reach for `grep`/`awk`/`sed` instead.
