---
name: GnuPG (gpg)
category: Cryptography
description: Encrypt, sign and verify with OpenPGP keys and the web of trust.
tags: [gpg, gnupg, openpgp, encryption, signing, keys]
---

# GnuPG (gpg)

**GnuPG** implements the OpenPGP standard: public-key encryption, digital signatures, key management and the web of trust. It's the tool behind package signing, encrypted email and signed releases.

> `apt install gnupg` · `brew install gnupg` · [gnupg.org](https://gnupg.org)

## Key management

```bash
gpg --full-generate-key                    # interactive key generation
gpg --list-keys                             # public keys in your keyring
gpg --list-secret-keys --keyid-format long # your private keys + long key IDs
gpg --fingerprint user@example.com
gpg --edit-key user@example.com            # add subkeys, set trust, expiry
```

## Export / import

```bash
gpg --armor --export user@example.com > pub.asc          # export public key (ASCII)
gpg --armor --export-secret-keys user@example.com > priv.asc   # export private key
gpg --import pub.asc                                       # import a key
gpg --recv-keys 0xKEYID                                    # fetch from a keyserver
gpg --send-keys 0xKEYID
```

## Encrypt / decrypt

```bash
gpg -e -r user@example.com file.txt        # encrypt to a recipient -> file.txt.gpg
gpg -e -a -r user@example.com file.txt     # ASCII-armored output (.asc)
gpg -d file.txt.gpg > file.txt             # decrypt
gpg -c file.txt                             # symmetric (passphrase) -> file.txt.gpg
```

## Sign and verify

```bash
gpg --sign file.txt                        # binary signature (file.txt.gpg)
gpg --clearsign message.txt                 # inline signature, readable text
gpg --detach-sign -a file.txt               # separate .asc signature (releases)
gpg --verify file.txt.asc file.txt          # verify a detached signature
gpg --verify release.tar.gz.sig             # verify (looks for release.tar.gz)
```

## Trust & fingerprints

Always verify a key's fingerprint out-of-band before trusting it:

```bash
gpg --fingerprint user@example.com
gpg --edit-key user@example.com   # then: trust  (set ultimate/full/marginal)
```

## Common security tasks

```bash
# Verify a downloaded package signature
gpg --recv-keys 0xPROJECTKEY
gpg --verify sha256sums.txt.gpg

# Encrypt a backup for yourself only
gpg -e -r me@example.com -o backup.tar.gpg backup.tar
```

> For simple "encrypt a file for a recipient" without keyrings or subkeys, [age](#/tool/age) is easier. Cracking a passphrase-protected private key is possible with [john](#/tool/john) via `gpg2john`.
