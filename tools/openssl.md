---
name: OpenSSL
category: Cryptography
description: Cryptography, certificates, keys and TLS connections from the command line.
tags: [crypto, tls, ssl, certificate, key, rsa]
---

# OpenSSL

**OpenSSL** is a command-line toolkit that covers most day-to-day crypto tasks: generating keys and certificates, encrypting files, computing hashes and digests, and inspecting or debugging TLS connections.

> `openssl version -a` shows the version and config directories · [openssl.org](https://www.openssl.org)

## Hashes and digests

```bash
openssl dgst -sha256 file.txt
openssl sha256 file.txt
openssl dgst -sha512 file.txt
echo -n "text" | openssl dgst -sha256
openssl dgst -sha256 -hmac "key" file.txt      # HMAC
```

## Random values

```bash
openssl rand -hex 32           # 32 bytes in hex (e.g. a key/secret)
openssl rand -base64 24        # random password
openssl rand -out key.bin 32   # raw bytes to a file
```

## Base64 and encoding

```bash
openssl base64 -in file.bin -out file.b64      # encode
openssl base64 -d -in file.b64 -out file.bin   # decode
echo -n "text" | openssl base64
```

## Symmetric file encryption

```bash
# Encrypt (AES-256 + password-based key derivation)
openssl enc -aes-256-cbc -salt -pbkdf2 -in plain.txt -out cipher.enc

# Decrypt
openssl enc -d -aes-256-cbc -pbkdf2 -in cipher.enc -out plain.txt

# Authenticated GCM (more modern)
openssl enc -aes-256-gcm -pbkdf2 -in plain.txt -out cipher.enc
```

> Always use `-pbkdf2` (or `-iter 100000`). The old key-derivation default is weak.

## RSA keys

```bash
openssl genrsa -out private.pem 4096                 # private key
openssl rsa -in private.pem -pubout -out public.pem  # extract public key
openssl rsa -in private.pem -text -noout             # inspect
openssl genrsa -aes256 -out private.pem 4096         # password-protected
```

### Encrypt/decrypt with RSA (small data)

```bash
openssl pkeyutl -encrypt -pubin -inkey public.pem -in plain.txt -out cipher.bin
openssl pkeyutl -decrypt -inkey private.pem -in cipher.bin -out plain.txt
```

## EC keys (elliptic curve)

```bash
openssl ecparam -name prime256v1 -genkey -noout -out ec-private.pem
openssl ec -in ec-private.pem -pubout -out ec-public.pem
openssl ecparam -list_curves                         # available curves
```

## Sign and verify

```bash
openssl dgst -sha256 -sign private.pem -out sig.bin file.txt
openssl dgst -sha256 -verify public.pem -signature sig.bin file.txt
```

## X.509 certificates

### Self-signed (quick, for testing)

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem \
  -days 365 -nodes -subj "/CN=localhost"
```

### CSR (request for a CA)

```bash
openssl req -new -newkey rsa:2048 -nodes -keyout domain.key -out domain.csr \
  -subj "/C=BR/ST=SP/L=Sao Paulo/O=Company/CN=example.com"
```

### Inspect certificates and CSRs

```bash
openssl x509 -in cert.pem -text -noout
openssl x509 -in cert.pem -noout -dates          # validity
openssl x509 -in cert.pem -noout -subject -issuer
openssl x509 -in cert.pem -noout -fingerprint -sha256
openssl req  -in domain.csr -text -noout
openssl verify -CAfile ca.pem cert.pem
```

### SAN (subject alternative names)

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes \
  -subj "/CN=example.com" \
  -addext "subjectAltName=DNS:example.com,DNS:www.example.com,IP:10.0.0.5"
```

## Format conversion

```bash
openssl x509 -in cert.pem -outform DER -out cert.der          # PEM -> DER
openssl x509 -in cert.der -inform DER -out cert.pem           # DER -> PEM
openssl pkcs12 -export -out bundle.pfx -inkey key.pem -in cert.pem   # -> PFX/P12
openssl pkcs12 -in bundle.pfx -out out.pem -nodes                    # PFX -> PEM
```

## TLS diagnostics (network)

```bash
# See the certificate a host serves
openssl s_client -connect example.com:443 -servername example.com

# Just the cert, non-interactive
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates

# Test a specific protocol version
openssl s_client -connect example.com:443 -tls1_2
openssl s_client -connect example.com:443 -tls1_3

# Full certificate chain
openssl s_client -connect example.com:443 -showcerts

# STARTTLS (SMTP, IMAP, etc.)
openssl s_client -connect smtp.example.com:587 -starttls smtp
```

## Quick recipes

```bash
# Check that a key and certificate match (the hashes must be equal)
openssl x509 -noout -modulus -in cert.pem | openssl md5
openssl rsa  -noout -modulus -in key.pem  | openssl md5

# Days until expiry
openssl x509 -enddate -noout -in cert.pem

# Generate a strong password
openssl rand -base64 32
```

> **Careful:** `-nodes` leaves the private key **without a passphrase** — handy on servers, risky on shared machines. MD5/SHA1 are fine for casual integrity, not for security.
