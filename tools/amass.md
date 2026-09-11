---
name: Amass
category: Reconnaissance
description: Attack-surface mapping and deep subdomain enumeration (OWASP).
tags: [subdomain, dns, osint, owasp, recon, asset, RTFM]
---

# Amass

**OWASP Amass** maps attack surfaces and enumerates subdomains by combining DNS resolution, OSINT sources, certificate transparency and brute-force. Built around the Open Asset Model (OAM), it stores results in a persistent database for tracking changes over time. It finds more than lighter tools, at the cost of taking longer.

> `apt install amass` · `go install -v github.com/owasp-amass/amass/v5/cmd/amass@main` · `brew install amass` · `docker pull owaspamass/amass` · [github.com/owasp-amass/amass](https://github.com/owasp-amass/amass)

## Subcommands (v5)

| Command | Purpose |
|---------|---------|
| `amass enum` | Subdomain enumeration (passive, active and brute-force) |
| `amass subs` | Query and display previously discovered subdomains |
| `amass track` | Compare enumerations to find newly discovered assets |
| `amass viz` | Generate asset-graph visualizations (D3, DOT, GEXF) |
| `amass engine` | Run the collection engine as a standalone service |
| `amass assoc` | Query the OAM database along relationship triples |

## Subdomain enumeration (`enum`)

```bash
# Passive (default) — queries OSINT sources only, doesn't touch the target
amass enum -d example.com
amass enum -d example.com -o results.txt

# Active — certificate grabbing, zone transfers, web crawling
amass enum -active -d example.com
amass enum -active -d example.com -p 80,443,8080

# Brute-force with wordlist
amass enum -brute -d example.com
amass enum -brute -w /usr/share/wordlists/dns.txt -d example.com

# Name alterations/permutations
amass enum -alts -d example.com

# Full aggressive scan (authorized targets only)
amass enum -active -brute -alts -w wordlist.txt -d example.com

# Multiple domains
amass enum -d example.com,target.org
amass enum -df domains.txt

# Show source per result and include IPs
amass enum -src -ip -d example.com

# Persistent database directory (keeps results for subs/track/viz)
amass enum -d example.com -dir ./pentest

# Use config with API keys
amass enum -config config.yaml -d example.com
```

### Key `enum` flags

| Flag | Purpose |
|------|---------|
| `-d` | Target domain(s) — comma-separated |
| `-df` | File containing target domains |
| `-active` | Enable active recon (certs, zone transfers) |
| `-passive` | Passive only (explicit — OSINT sources, no DNS) |
| `-brute` | DNS brute-force enumeration |
| `-alts` | Generate name alterations/permutations |
| `-w` | Wordlist for brute-force |
| `-wm` | Hashcat-style mask for brute-force (e.g. `"?l?l?l"`) |
| `-aw` | Wordlist for name alterations |
| `-awm` | Hashcat-style mask for alterations |
| `-ip` / `-ipv4` / `-ipv6` | Include IP addresses in output |
| `-src` | Show data source for each result |
| `-p` | Ports for active scanning (default: 443) |
| `-r` | Custom DNS resolvers (comma-separated IPs) |
| `-rf` | File containing resolvers |
| `-tr` / `-trf` | Trusted resolvers / file |
| `-dns-qps` | Max DNS queries per second |
| `-rqps` / `-trqps` | QPS per untrusted / trusted resolver |
| `-bl` / `-blf` | Blacklist subdomain / file |
| `-min-for-recursive` | Discoveries before recursive brute-force (default: 1) |
| `-max-depth` | Maximum subdomain label depth |
| `-norecursive` | Disable recursive brute-force |
| `-include` / `-exclude` | Use / skip specific data sources |
| `-list` | Print available data sources |
| `-config` | YAML config file path |
| `-dir` | Output / database directory |
| `-o` | Text output file |
| `-oA` | Prefix for all output files |
| `-log` | Error log file |
| `-timeout` | Max execution time in minutes |
| `-v` | Verbose output |
| `-silent` | Suppress all terminal output |

## Viewing results (`subs`)

Query the database without running a new scan:

```bash
amass subs -d example.com -dir ./pentest          # list discovered subdomains
amass subs -d example.com -ip -dir ./pentest       # include IP addresses
amass subs -d example.com -ipv4 -dir ./pentest     # IPv4 only
amass subs -d example.com -summary -dir ./pentest  # ASN summary table
amass subs -d example.com -show -dir ./pentest     # names + summary combined
amass subs -d example.com -o subs.txt -dir ./pentest
```

## Tracking changes (`track`)

Compare enumerations over time to spot new assets:

```bash
amass track -d example.com -dir ./pentest
amass track -d example.com -since "01/02 15:04:05 2026 UTC" -dir ./pentest
```

## Visualizations (`viz`)

```bash
amass viz -d3 -d example.com -dir ./pentest        # interactive D3 graph (HTML)
amass viz -dot -d example.com -dir ./pentest       # DOT format (Graphviz)
amass viz -gexf -d example.com -dir ./pentest      # GEXF format (Gephi)
```

## Engine (remote mode)

Run the engine as a service and connect from `enum`:

```bash
amass engine -log-dir ./logs                                     # start the engine
amass enum -engine http://127.0.0.1:4000 -d example.com          # remote enumeration
```

## Configuration

Amass v5 uses **YAML** config files (not INI). Default locations:

- Linux: `~/.config/amass/config.yaml`
- macOS: `~/Library/Application Support/amass/config.yaml`
- Windows: `%AppData%\amass\config.yaml`

### config.yaml

```yaml
scope:
  domains:
    - domain: example.com
  blacklisted:
    - subdomain: internal.example.com
  ports: [80, 443, 8080]

options:
  datasources: datasources.yaml   # path to API keys file
  bruteforce:
    enabled: true
    recursive: true
    minimum_for_recursive: 2
    wordlist_file: /path/to/wordlist.txt
  alterations:
    enabled: true
    flip_words: true
    flip_numbers: true
    add_words: true
    add_numbers: true
    wordlist_file: /path/to/alterations.txt
  resolvers:
    - 1.1.1.1
    - 8.8.8.8
```

### datasources.yaml (API keys)

Add keys to greatly expand the number of sources. See available sources with `amass enum -list`.

```yaml
datasources:
  - name: Shodan
    creds:
      account:
        apikey: "YOUR_KEY"
  - name: VirusTotal
    creds:
      account:
        apikey: "YOUR_KEY"
  - name: SecurityTrails
    creds:
      account:
        apikey: "YOUR_KEY"
  - name: Censys
    creds:
      account:
        apikey: "YOUR_KEY"
        secret: "YOUR_SECRET"
  - name: PassiveTotal
    creds:
      account:
        username: "user@example.com"
        apikey: "YOUR_KEY"
global_options:
  minimum_ttl: 1440
```

## Recon modes at a glance

| Mode | Detection | Typical results | Duration |
|------|-----------|-----------------|----------|
| Passive (default) | None | 50–200 subs | 2–5 min |
| Active (`-active`) | High | 200–500 subs | 10–30 min |
| Brute-force (`-brute`) | Very high | 500–2000+ subs | 1–3 hours |

## Recipes

```bash
# Quiet passive recon feeding other tools
amass enum -d example.com -o subs.txt
cat subs.txt | httpx -silent -title -tech-detect -o live.txt

# Daily monitoring (store in persistent dir, then track)
amass enum -d example.com -dir ./recon
amass track -d example.com -dir ./recon

# Full assessment with config
amass enum -active -brute -alts -config config.yaml -d example.com -dir ./output
amass viz -d3 -d example.com -dir ./output

# Docker one-liner
docker run -v $(pwd)/output:/.config/amass/ owaspamass/amass enum -d example.com
```

> Passive mode is safe for initial recon; `-active` and `-brute` touch the target — use only within authorized scope. Always use `-dir` to persist results for `subs`/`track`/`viz`. Feed results into [httpx](#/tool/httpx), and compare with [subfinder](#/tool/subfinder)/[theHarvester](#/tool/theharvester).
