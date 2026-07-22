---
name: steghide
category: Forensics & Reverse Engineering
description: Hide and extract data inside images and audio (steganography).
tags: [steghide, steganography, hidden, ctf, jpeg, forensics]
---

# steghide

**steghide** embeds (and extracts) data inside JPEG, BMP, WAV and AU files, optionally encrypted with a passphrase. It's a fixture of CTF forensics — "the flag is in this image" — and a simple way to hide a small payload in a carrier file.

> `apt install steghide` · works on JPEG/BMP/WAV/AU (not PNG/GIF)

## Extract (the common case)

```bash
steghide extract -sf image.jpg                 # prompts for the passphrase
steghide extract -sf image.jpg -p ''            # empty passphrase
steghide extract -sf image.jpg -p secret -xf out.bin
steghide info image.jpg                          # is there embedded data? (needs pass)
```

## Embed

```bash
steghide embed -cf cover.jpg -ef secret.txt              # hide secret.txt in cover.jpg
steghide embed -cf cover.wav -ef data.zip -p passphrase
steghide embed -cf cover.jpg -ef secret.txt -sf out.jpg  # keep original, write out.jpg
```

## Brute-forcing the passphrase (CTF)

steghide has no built-in cracker, but `stegseek` (a drop-in) is very fast:

```bash
stegseek image.jpg rockyou.txt                   # tries the wordlist, extracts on hit
stegseek --crack image.jpg wordlist.txt out.bin
```

## Where it fits in a stego workflow

```bash
file image.jpg                     # confirm the real type
exiftool image.jpg                  # metadata / comments
strings image.jpg | less            # plaintext clues, passphrases
binwalk image.jpg                    # appended/embedded files (different technique)
steghide info image.jpg             # steghide-embedded data
```

> steghide only handles its own format — PNG/GIF need other tools (`zsteg`, `stegsolve`). Data simply appended to a file is found faster with [binwalk](#/tool/binwalk)/[foremost](#/tool/foremost); metadata with [exiftool](#/tool/exiftool).
