---
name: age
category: Cryptography
description: Modern, simple file encryption with small keys and no config.
tags: [age, encryption, file, x25519, crypto, keys]
---

# age

**age** is a small file-encryption tool with a deliberately tiny feature set: one algorithm, short keys, no options to get wrong. It replaces most day-to-day uses of GnuPG for "encrypt this file for this recipient". `rage` is a compatible Rust implementation.

> `apt install age` · `brew install age` · [github.com/FiloSottile/age](https://github.com/FiloSottile/age)

## Key pairs

```bash
age-keygen -o key.txt                     # generate a key pair
# Public key is printed and stored in key.txt as a comment
age-keygen -y key.txt                      # print the public key from a private key
```

A key looks like `age1ql3z...` (public) / `AGE-SECRET-KEY-1...` (private).

## Encrypt / decrypt to a recipient (public key)

```bash
age -r age1ql3z... -o secret.age secret.txt        # encrypt to a recipient
age -R recipients.txt -o secret.age secret.txt      # multiple recipients from a file
age -d -i key.txt -o secret.txt secret.age          # decrypt with your private key
```

## Passphrase mode (symmetric)

```bash
age -p -o secret.age secret.txt            # prompts for a passphrase
age -d -o secret.txt secret.age            # prompts to decrypt
```

## SSH keys as age keys (handy)

age can encrypt to an existing SSH public key and decrypt with the matching private key:

```bash
age -R ~/.ssh/id_ed25519.pub -o secret.age secret.txt
age -d -i ~/.ssh/id_ed25519 -o secret.txt secret.age
# Encrypt to someone's GitHub keys:
curl https://github.com/USER.keys | age -R - -o secret.age secret.txt
```

## Pipes and directories

```bash
tar czf - mydir/ | age -r age1ql3z... > mydir.tar.gz.age     # encrypt a whole dir
age -d -i key.txt mydir.tar.gz.age | tar xzf -                # decrypt + extract
echo "secret" | age -r age1ql3z... | age -d -i key.txt
```

> No key servers, web-of-trust or subkeys — if you need those, use [gpg](#/tool/gpg). Keep `key.txt` (or your SSH private key) safe; losing it means losing the data. For TLS/certs and hashing, see [openssl](#/tool/openssl).
