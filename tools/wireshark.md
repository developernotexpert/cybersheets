---
name: Wireshark
category: Traffic Analysis & Wireless
description: Interactive packet analyzer with a rich display-filter language.
tags: [wireshark, pcap, packets, sniffer, filters, network]
---

# Wireshark

**Wireshark** is a widely used network protocol analyzer. It captures packets in real time and lets you inspect traffic layer by layer. Once you're comfortable with display filters, most of your time is spent writing them.

> `tshark` is the CLI version · `dumpcap` is the capture engine · [wireshark.org](https://www.wireshark.org)

## Capture vs. display filters

- **Capture (BPF):** decide what gets recorded. `tcpdump`-style syntax. Can't be undone later.
- **Display:** filter what's shown on screen without dropping packets. Wireshark's own syntax.

```text
# Capture filter (BPF)
host 10.0.0.5
net 192.168.0.0/24
tcp port 443
not arp and not broadcast
```

## Display filters — comparators

| Operator | Alt | Meaning |
|----------|-----|---------|
| `==` | `eq` | equal |
| `!=` | `ne` | not equal |
| `>` `<` | `gt` `lt` | greater / less |
| `&&` | `and` | logical AND |
| `\|\|` | `or` | logical OR |
| `!` | `not` | negation |
| `contains` | | contains bytes/string |
| `matches` | | regular expression |

## By address and port

```text
ip.addr == 10.0.0.5
ip.src == 10.0.0.5 && ip.dst == 8.8.8.8
tcp.port == 443
udp.port == 53
tcp.port == 80 || tcp.port == 443
ip.addr == 192.168.0.0/24
eth.addr == 00:11:22:33:44:55
```

## By protocol

```text
http
dns
tcp
tls
icmp
arp
dhcp
smb2
ftp || ftp-data
```

## HTTP

```text
http.request.method == "POST"
http.request.uri contains "login"
http.host == "example.com"
http.response.code == 200
http.response.code >= 400
http contains "password"
```

## DNS

```text
dns.qry.name contains "google"
dns.flags.response == 0        # queries only
dns.flags.response == 1        # responses only
dns.a == 8.8.8.8
```

## TCP — flags and analysis

```text
tcp.flags.syn == 1 && tcp.flags.ack == 0    # connection start (SYN)
tcp.flags.reset == 1                         # reset connections
tcp.analysis.retransmission                  # retransmissions
tcp.analysis.flags                           # all detected problems
tcp.stream eq 3                              # isolate one TCP conversation
tcp.len > 0                                  # packets carrying payload
```

## TLS / HTTPS

```text
tls.handshake.type == 1                      # Client Hello
tls.handshake.extensions_server_name         # SNI (domain visited)
tls.handshake.version == 0x0303              # TLS 1.2
tls.record.content_type == 21                # TLS alerts
```

## Quick detection & forensics

```text
tcp.flags.syn == 1 and tcp.window_size <= 1024     # possible port scan
http.request and !(ip.dst == 10.0.0.0/8)           # HTTP leaving the network
frame contains "password"
frame matches "(?i)authorization: basic"
data-text-lines contains "GET"
```

## Interface tricks

- **Follow Stream:** right-click a packet → *Follow → TCP/HTTP/TLS Stream* to reassemble the whole conversation.
- **Statistics → Conversations:** ranking of who talks the most.
- **Statistics → Protocol Hierarchy:** traffic breakdown by protocol.
- **File → Export Objects → HTTP:** extract transferred files (images, binaries).
- Click any packet field to turn it into a filter (right-click → *Apply as Filter*).

## tshark (command line)

```bash
tshark -D                                   # list interfaces
tshark -i eth0                              # live capture
tshark -i eth0 -f "tcp port 80"             # capture filter
tshark -r capture.pcap -Y "http.request"    # display filter on a file
tshark -r capture.pcap -T fields -e ip.src -e ip.dst -e http.host
tshark -i eth0 -w out.pcap -a duration:60   # record 60s to a file
```

> **Tip:** a valid display filter turns the bar **green**; red = invalid syntax; yellow = might not do what you expect (e.g. `ip.addr != x` is a common logic mistake). Automate the same filters with [tshark](#/tool/tshark) and capture on servers with [tcpdump](#/tool/tcpdump).
