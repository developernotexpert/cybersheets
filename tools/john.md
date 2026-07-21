---
name: John the Ripper
category: Passwords & Hashes
description: Highly customizable offline password hash cracker with many formats.
tags: [john, jtr, hash, password, crack, wordlist]
---

# John the Ripper

**John the Ripper** (JtR) is a flexible offline password cracker. It's strong on CPU, auto-detects many hash formats, and ships the invaluable `*2john` utilities that extract crackable hashes from files (zip, ssh, pdf, office…).

> `apt install john` · the "jumbo" build adds hundreds of formats · [openwall.com/john](https://www.openwall.com/john/)

## Basic usage

```bash
john hashes.txt                                   # single mode + default wordlist
john --wordlist=rockyou.txt hashes.txt
john --wordlist=rockyou.txt --rules hashes.txt     # apply mangling rules
john --format=raw-md5 --wordlist=rockyou.txt hashes.txt
john --show hashes.txt                              # display cracked passwords
```

## Cracking modes

```bash
john --single hashes.txt              # uses GECOS/username info
john --wordlist=rockyou.txt hashes.txt
john --incremental hashes.txt          # brute-force
john --mask='?u?l?l?l?d?d' hashes.txt   # mask (hashcat-style)
```

## Formats

```bash
john --list=formats                    # list supported formats
john --format=nt hashes.txt            # force NTLM
john --format=sha512crypt hashes.txt
```

## `*2john` — extract hashes from files

```bash
zip2john secret.zip > hash.txt
rar2john secret.rar > hash.txt
ssh2john id_rsa > hash.txt
pdf2john doc.pdf > hash.txt
office2john doc.docx > hash.txt
keepass2john db.kdbx > hash.txt
# then:
john --wordlist=rockyou.txt hash.txt
```

## Sessions & management

```bash
john --session=job1 --wordlist=rockyou.txt hashes.txt
john --restore=job1
john --status=job1
john hashes.txt --pot=custom.pot       # custom potfile
```

> `--single` first (cheap, context-based), then wordlist + `--rules`, then incremental/mask. For raw GPU speed on large jobs, use [hashcat](#/tool/hashcat). Identify unknown hashes with [hash-identifier](#/tool/hash-identifier).
