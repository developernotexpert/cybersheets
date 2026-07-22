---
name: DirBuster
category: Web & Fuzzing
description: OWASP GUI/CLI brute-forcer for web directories and files.
tags: [dirbuster, directory, bruteforce, web, owasp, content]
---

# DirBuster

**DirBuster** is an OWASP Java tool for brute-forcing directories and file names on web servers. It's older and heavier than the CLI fuzzers, but the GUI, recursion and "pure brute force" (generated names, not just wordlists) still make it useful — and its wordlists are worth having on their own.

> `apt install dirbuster` · GUI: run `dirbuster` · [OWASP DirBuster project](https://owasp.org/www-project-dirbuster/)

## GUI workflow

1. **Target URL** — e.g. `http://alvo:80/`.
2. **Work method** — "Auto Switch (HEAD and GET)" is usually fine.
3. **Wordlist** — pick one from `/usr/share/wordlists/dirbuster/` (see below), or choose **Pure Brute Force** with a charset.
4. **File extensions** — e.g. `php,html,txt,bak`.
5. Set threads (20–50) and **Start**. Results appear as a tree and a list.

## Headless / CLI

```bash
dirbuster -H -u http://alvo/ \
  -l /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt \
  -e php,html,txt -t 30 -r report.txt
```

- `-H` headless (no GUI) · `-u` URL · `-l` wordlist · `-e` extensions · `-t` threads · `-r` report file.

## Bundled wordlists (worth reusing)

```text
/usr/share/wordlists/dirbuster/directory-list-2.3-small.txt
/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt   # common default
/usr/share/wordlists/dirbuster/directory-list-2.3-big.txt
/usr/share/wordlists/dirbuster/apache-user-enum-*.txt
```

These feed straight into faster tools.

## Tips

- Route through Burp by setting an upstream proxy in DirBuster's options.
- Recursion is on by default — it can explode on large sites; cap depth or uncheck it.
- It's noisy and slow compared to modern fuzzers.

> For speed, prefer [ffuf](#/tool/ffuf) or [gobuster](#/tool/gobuster) and feed them DirBuster's wordlists; [dirb](#/tool/dirb) is the lighter CLI classic. DirBuster earns its place mainly for the GUI and pure brute-force mode.
