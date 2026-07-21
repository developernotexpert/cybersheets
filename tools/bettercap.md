---
name: bettercap
category: Traffic Analysis & Wireless
description: Framework for MITM, ARP/DNS spoofing, sniffing and wireless auditing.
tags: [mitm, arp-spoof, dns-spoof, sniffer, wifi, bettercap]
---

# bettercap

**bettercap** bundles most LAN attack and monitoring tasks into one tool: ARP/DNS spoofing, MITM, credential sniffing, and Wi-Fi / BLE / HID auditing. It's modular, scriptable via "caplets", and ships a web UI.

> `apt install bettercap` · **requires root** · [bettercap.org](https://www.bettercap.org)

## Start

```bash
sudo bettercap -iface eth0
sudo bettercap -iface eth0 -eval "net.probe on; net.recon on"
```

Interactive prompt uses **modules** you turn `on`/`off` and **parameters** you `set`.

## Discover hosts

```text
> net.probe on            # actively discover LAN hosts
> net.show                # list discovered hosts
```

## ARP spoofing MITM + sniffing

```text
> set arp.spoof.targets 10.0.0.5
> arp.spoof on
> net.sniff on            # capture traffic flowing through you
> set net.sniff.regexp .*password.*
```

Full-duplex + capture creds:

```text
> set arp.spoof.fullduplex true
> set arp.spoof.targets 10.0.0.5
> arp.spoof on; net.sniff on
```

## DNS spoofing

```text
> set dns.spoof.domains exemplo.com,*.exemplo.com
> set dns.spoof.address 10.0.0.99
> dns.spoof on
```

## HTTP(S) proxy & injection

```text
> set http.proxy.sslstrip true
> http.proxy on
> set https.proxy on
```

## Wi-Fi auditing

```text
> wifi.recon on               # scan APs/clients (needs monitor-mode iface)
> wifi.show
> wifi.deauth <BSSID>          # deauth clients (capture handshake)
> set wifi.handshakes.file /tmp/handshakes.pcap
```

## Caplets & web UI

```bash
sudo bettercap -caplet http-ui        # web UI (default 127.0.0.1:80)
> caplets.show                         # list available caplets
```

> **Very intrusive** — it rewrites LAN traffic, so keep it to authorized internal engagements. Effectively the successor to ettercap; for Wi-Fi handshake cracking, pair it with [aircrack-ng](#/tool/aircrack-ng).
