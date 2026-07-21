---
name: Hashcat
category: Passwords & Hashes
description: GPU-accelerated password/hash cracker with dictionary, rule, mask and hybrid attacks.
tags: [hashcat, hash, password, gpu, crack, wordlist, mask]
---

# Hashcat

**Hashcat** is a GPU-accelerated password recovery tool, and one of the fastest options when you have a capable GPU. It cracks a wide range of hash types with dictionary, rule-based, mask (brute-force) and hybrid attacks. Only run it against hashes you're authorized to test.

> `apt install hashcat` · [hashcat.net](https://hashcat.net) · needs GPU drivers (OpenCL/CUDA) for full speed

## Syntax

```bash
hashcat -m <hash-mode> -a <attack-mode> hashes.txt wordlist.txt
```

## Attack modes (`-a`)

| `-a` | Attack |
|------|--------|
| `0` | Dictionary |
| `1` | Combinator |
| `3` | Mask / brute-force |
| `6` | Wordlist + mask (hybrid) |
| `7` | Mask + wordlist |

## Common hash modes (`-m`)

| `-m` | Hash |
|------|------|
| `0` | MD5 |
| `100` | SHA1 |
| `1400` | SHA-256 |
| `1000` | NTLM |
| `5600` | NetNTLMv2 (Responder) |
| `1800` | sha512crypt `$6$` (Linux) |
| `3200` | bcrypt `$2*$` |
| `22000` | WPA-PBKDF2 / PMKID |
| `13100` | Kerberos TGS-REP (Kerberoast) |
| `18200` | Kerberos AS-REP |

> Find a mode: `hashcat --help | grep -i <algo>` · identify with [hash-identifier](#/tool/hash-identifier).

## Dictionary attack (+ rules)

```bash
hashcat -m 0 -a 0 hashes.txt rockyou.txt
hashcat -m 1000 -a 0 ntlm.txt rockyou.txt -O                 # -O optimized kernel
hashcat -m 0 -a 0 hashes.txt rockyou.txt -r rules/best64.rule
```

## Mask attack (targeted brute-force)

Charsets: `?l` lower · `?u` upper · `?d` digit · `?s` symbol · `?a` all.

```bash
hashcat -m 0 -a 3 hashes.txt ?l?l?l?l?l?l              # 6 lowercase
hashcat -m 0 -a 3 hashes.txt ?u?l?l?l?l?d?d            # Xxxxx99
hashcat -m 0 -a 3 hashes.txt Pass?d?d?d?d              # fixed prefix
hashcat -m 0 -a 3 hashes.txt -1 ?l?d ?1?1?1?1          # custom charset ?1
hashcat -m 0 -a 3 hashes.txt ?a?a?a?a --increment      # growing length
```

## Hybrid (wordlist + mask)

```bash
hashcat -m 0 -a 6 hashes.txt rockyou.txt ?d?d?d        # word + 3 digits
hashcat -m 0 -a 7 hashes.txt ?d?d?d rockyou.txt        # 3 digits + word
```

## Sessions, status, results

```bash
hashcat -m 0 -a 0 hashes.txt rockyou.txt --session=job1
hashcat --session=job1 --restore
hashcat -m 0 hashes.txt --show                          # show cracked
hashcat -m 0 -a 0 hashes.txt rockyou.txt -o cracked.txt
hashcat -b -m 22000                                     # benchmark a mode
```

Runtime keys: `s` status · `p` pause · `r` resume · `q` quit.

> Start with dictionary + rules, escalate to masks/brute-force. Best rules: `best64`, `OneRuleToRuleThemAll`. The CPU-focused counterpart is [john](#/tool/john).
