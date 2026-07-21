---
name: tshark
category: Traffic Analysis & Wireless
description: Wireshark's CLI for capturing and programmatically analyzing .pcap files.
tags: [tshark, wireshark, pcap, cli, packets, fields]
---

# tshark

**tshark** is the command-line version of [Wireshark](#/tool/wireshark). It captures live traffic and applies the same **display filters** and field extraction to `.pcap` files, which is what makes it useful for scripting and pulling out exactly the fields you need.

> ships with Wireshark · `apt install tshark` · uses the same dissectors as the GUI

## Capture

```bash
tshark -D                              # list interfaces
tshark -i eth0                          # live capture
tshark -i eth0 -c 100                    # stop after 100 packets
tshark -i eth0 -w capture.pcap           # write to file
tshark -i eth0 -a duration:60 -w cap.pcap  # capture for 60s
```

## Capture vs display filters

```bash
tshark -i eth0 -f "tcp port 80"          # -f capture filter (BPF)
tshark -r capture.pcap -Y "http.request" # -Y display filter (Wireshark syntax)
```

## Extract specific fields

```bash
tshark -r cap.pcap -T fields -e ip.src -e ip.dst -e tcp.port
tshark -r cap.pcap -Y "http.request" -T fields -e http.host -e http.request.uri
tshark -r cap.pcap -Y dns -T fields -e dns.qry.name
tshark -r cap.pcap -T fields -e ip.src -E separator=, -E header=y   # CSV-like
```

## Common analysis

```bash
tshark -r cap.pcap -Y "http.request.method == POST"
tshark -r cap.pcap -Y "tls.handshake.extensions_server_name" \
  -T fields -e tls.handshake.extensions_server_name       # SNIs (domains)
tshark -r cap.pcap -Y "tcp.analysis.retransmission"
tshark -r cap.pcap -Y 'frame contains "password"'
```

## Statistics

```bash
tshark -r cap.pcap -q -z io,phs               # protocol hierarchy
tshark -r cap.pcap -q -z conv,tcp             # TCP conversations
tshark -r cap.pcap -q -z endpoints,ip         # top talkers
tshark -r cap.pcap -q -z http,tree            # HTTP stats
```

## Follow a stream / extract creds

```bash
tshark -r cap.pcap -z follow,tcp,ascii,3 -q    # reassemble TCP stream #3
tshark -r cap.pcap -Y "ftp.request.command == USER || ftp.request.command == PASS" \
  -T fields -e ftp.request.arg
```

> Same filter language as [Wireshark](#/tool/wireshark), but automatable — ideal for extracting fields from big captures produced by [tcpdump](#/tool/tcpdump). Pipe field output into `sort | uniq -c` for quick summaries.
