---
name: Zeek
category: Forensics & Reverse Engineering
description: Network traffic analysis framework that turns packets into structured event logs.
tags: [zeek, bro, nsm, logs, traffic, monitoring]
---

# Zeek

**Zeek** (formerly Bro) is a network security monitoring framework. Instead of raw packets, it emits **structured logs** of what happens on the wire — connections, DNS, HTTP, TLS, files — and gives you a scripting language for custom detection. Many NSM/IDS pipelines are built around it.

> `apt install zeek` (or from OpenSUSE OBS) · binaries under `/opt/zeek/bin` · [zeek.org](https://zeek.org)

## Process a pcap (most common for forensics)

```bash
zeek -r capture.pcap                     # generates *.log files in the cwd
zeek -r capture.pcap local               # with the default "local" policy/scripts
```

This creates `conn.log`, `dns.log`, `http.log`, `ssl.log`, `files.log`, `weird.log`, etc.

## Live monitoring

```bash
sudo zeek -i eth0                         # analyze a live interface
sudo zeekctl deploy                        # managed cluster deployment
```

## Reading the logs

Logs are TSV. Use **zeek-cut** to pull fields:

```bash
cat conn.log | zeek-cut id.orig_h id.resp_h id.resp_p proto service
cat dns.log  | zeek-cut query | sort | uniq -c | sort -rn        # top DNS queries
cat http.log | zeek-cut host uri method status_code
cat ssl.log  | zeek-cut server_name                              # SNIs / domains
```

## Key logs

| Log | Contents |
|-----|----------|
| `conn.log` | Every connection (the master index) |
| `dns.log` | DNS queries/answers |
| `http.log` | HTTP requests/responses |
| `ssl.log` | TLS handshakes, SNI, certs |
| `files.log` | Files seen traversing the network |
| `notice.log` | Zeek's flagged notices |
| `weird.log` | Protocol anomalies |

## Extract transferred files

```bash
zeek -r capture.pcap /opt/zeek/share/zeek/policy/frameworks/files/extract-all-files.zeek
ls extract_files/                          # carved files
```

## Custom detection (scripting)

```zeek
# alert.zeek — notice on connections to a bad IP
event connection_established(c: connection) {
    if ( c$id$resp_h == 1.2.3.4 )
        print fmt("Contact with bad host from %s", c$id$orig_h);
}
```
```bash
zeek -r capture.pcap alert.zeek
```

> Zeek excels at turning big captures into queryable logs for threat hunting. Feed it pcaps from [tcpdump](#/tool/tcpdump); pivot suspicious flows into [Wireshark](#/tool/wireshark)/[tshark](#/tool/tshark) for packet-level detail.
