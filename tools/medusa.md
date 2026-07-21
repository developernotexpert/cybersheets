---
name: Medusa
category: Passwords & Hashes
description: Massively parallel, modular network login brute-forcer.
tags: [medusa, bruteforce, login, parallel, online, modular]
---

# Medusa

**Medusa** is a speedy, massively parallel, modular login brute-forcer for network services. Similar goal to [hydra](#/tool/hydra), with a thread-based design and clean module structure.

> `apt install medusa` · [github.com/jmk-foofus/medusa](https://github.com/jmk-foofus/medusa)

## Syntax

```bash
medusa -h <host> -u <user> -P <passlist> -M <module>
medusa -H hosts.txt -U users.txt -P pass.txt -M ssh
```

- `-h`/`-H` host / host file · `-u`/`-U` user / user file
- `-p`/`-P` pass / pass file · `-M` module · `-t` parallel threads
- `-f` stop on first success (per host) · `-F` stop globally · `-n` port

## List modules

```bash
medusa -d                        # list all installed modules
```

Common: `ssh`, `ftp`, `smbnt`, `rdp`, `mysql`, `mssql`, `http`, `web-form`, `telnet`, `vnc`, `postgres`.

## Examples

```bash
medusa -h 10.0.0.5 -u root -P rockyou.txt -M ssh
medusa -H hosts.txt -U users.txt -P pass.txt -M ftp -t 10
medusa -h 10.0.0.5 -u admin -P pass.txt -M smbnt
medusa -h 10.0.0.5 -u sa -P pass.txt -M mssql
```

## HTTP web form

```bash
medusa -h 10.0.0.5 -u admin -P pass.txt -M web-form \
  -m FORM:"/login.php" -m DENY-SIGNAL:"Invalid" \
  -m FORM-DATA:"post?user=&pass="
```

## Combo lists & tuning

```bash
medusa -h 10.0.0.5 -C combos.txt -M ssh        # combo file user:pass
medusa ... -t 20 -T 5                            # -t threads/host, -T hosts in parallel
medusa ... -e ns                                  # also try null & same-as-user
medusa ... -O results.log                         # log output
```

> Medusa parallelizes across **hosts** especially well, making it strong for spraying one credential across many targets. Mind lockout policies. Alternative: [hydra](#/tool/hydra).
