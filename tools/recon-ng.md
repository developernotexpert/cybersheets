---
name: Recon-ng
category: Reconnaissance
description: Modular terminal OSINT framework, Metasploit-style.
tags: [osint, framework, recon, modules, automation]
---

# Recon-ng

**Recon-ng** is a web reconnaissance framework in the terminal, with a Metasploit-like interface: workspaces, modules, a database and API keys. It automates OSINT collection and correlates the results.

> `apt install recon-ng` · `pip install recon-ng` · [github.com/lanmaster53/recon-ng](https://github.com/lanmaster53/recon-ng)

## Basic flow

```bash
recon-ng
```
```text
[recon-ng][default] > workspaces create example      # create a workspace
[recon-ng][example] > marketplace search              # list available modules
[recon-ng][example] > marketplace install all         # install all (or by name)
[recon-ng][example] > modules search                  # already-installed modules
```

## Working with a domain

```text
> db insert domains                     # add a domain (interactive)
> modules load recon/domains-hosts/hackertarget
> info                                  # module options
> options set SOURCE example.com
> run
> show hosts                            # view collected hosts
```

## Chaining modules (Recon-ng's strength)

```text
recon/domains-hosts/hackertarget        domain -> hosts
recon/domains-hosts/bing_domain_web     domain -> hosts (Bing)
recon/hosts-hosts/resolve               resolve host IPs
recon/hosts-ports/shodan_ip             hosts -> ports (Shodan)
recon/domains-contacts/whois_pocs       contacts via WHOIS
reporting/html                          generate an HTML report
```

Each module consumes data from one table and feeds another — keep stacking them.

## API keys

```text
> keys list
> keys add shodan_api YOUR_KEY
> keys add virustotal_api YOUR_KEY
```

## Reports

```text
> modules load reporting/html
> options set FILENAME /tmp/report.html
> options set CREATOR you
> run
```

> Many modules need an API key. Start with the free ones (hackertarget, crt.sh, bing) and add keys to expand. Combine with [theHarvester](#/tool/theharvester) and [Amass](#/tool/amass).
