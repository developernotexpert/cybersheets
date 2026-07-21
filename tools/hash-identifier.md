---
name: hash-identifier
category: Passwords & Hashes
description: Analyze and identify the algorithm behind a hash string.
tags: [hash, identify, hashid, algorithm, crack]
---

# hash-identifier

Utilities to **identify the algorithm** of an unknown hash before cracking it — so you can pick the right `-m` for [hashcat](#/tool/hashcat) or `--format` for [john](#/tool/john). Two common tools: the interactive `hash-identifier` and the scriptable `hashid`.

> `apt install hash-identifier hashid` · both ship on Kali

## hash-identifier (interactive)

```bash
hash-identifier
# paste the hash at the prompt; it lists possible algorithms by likelihood
```

## hashid (scriptable, shows hashcat/john modes)

```bash
hashid '5f4dcc3b5aa765d61d8327deb882cf99'
hashid -m '5f4dcc3b5aa765d61d8327deb882cf99'      # show hashcat mode (-m)
hashid -j '$1$abc$...'                              # show john format (-j)
hashid -mj hash.txt                                 # read hashes from a file
```

Example output flags the candidates, e.g. MD5 → hashcat mode `0`, john `raw-md5`.

## Reading the clues yourself

| Pattern | Likely |
|---------|--------|
| 32 hex chars | MD5 / NTLM |
| 40 hex chars | SHA1 |
| 64 hex chars | SHA-256 |
| `$1$...` | md5crypt |
| `$5$...` / `$6$...` | sha256crypt / sha512crypt |
| `$2a$`/`$2b$` | bcrypt |
| `$krb5tgs$` | Kerberos TGS (Kerberoast) |
| `aad3b435...:...` | LM:NTLM pair |

## Workflow

```bash
hashid -m unknown.hash          # -> "Mode 1000 (NTLM)"
hashcat -m 1000 unknown.hash rockyou.txt
```

> Identification is a **best guess** — several algorithms share the same length. If the top pick doesn't crack, try the next candidate. Context (where you found it) often decides it.
