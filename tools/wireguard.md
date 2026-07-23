---
name: WireGuard
category: Connection & Pivoting
description: Fast, modern VPN tunnel — encrypted access into a network and a base for pivoting.
tags: [wireguard, vpn, tunnel, wg, pivot, routing, socks]
---

# WireGuard

**WireGuard** is a lean, high-performance VPN built on modern crypto (Curve25519, ChaCha20). It sets up an encrypted point-to-point tunnel with a tiny config — handy for reaching an internal network from your box, or as a stable route to pivot through once you control a host.

> `apt install wireguard` · `brew install wireguard-tools` · [wireguard.com](https://www.wireguard.com/) · needs root to bring interfaces up

## Generate keys

```bash
wg genkey | tee privatekey | wg pubkey > publickey   # keypair
wg genpsk > preshared.key                             # optional pre-shared key (extra layer)
```

## Minimal config (`/etc/wireguard/wg0.conf`)

```ini
[Interface]
PrivateKey = <your-privatekey>
Address    = 10.0.0.2/24          # your IP inside the tunnel
DNS        = 10.0.0.1             # optional

[Peer]
PublicKey  = <peer-publickey>
Endpoint   = vpn.example.com:51820
AllowedIPs = 10.0.0.0/24          # which traffic goes through the tunnel
PersistentKeepalive = 25          # keep NAT mappings alive
```

`AllowedIPs = 0.0.0.0/0` routes **all** traffic through the tunnel; a specific CIDR (e.g. `10.10.10.0/24`) makes it a split-tunnel that only reaches that subnet.

## Bring it up / down

```bash
wg-quick up wg0                 # start the tunnel from wg0.conf
wg-quick down wg0               # stop it
wg                              # status: peers, handshakes, transfer
wg show wg0 latest-handshakes   # confirm the tunnel is actually live
systemctl enable --now wg-quick@wg0   # persist across reboots
```

## Server side (accept peers)

```ini
[Interface]
PrivateKey = <server-privatekey>
Address    = 10.0.0.1/24
ListenPort = 51820
# enable routing so peers can reach the LAN behind the server:
PostUp   = sysctl -w net.ipv4.ip_forward=1; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
PublicKey  = <client-publickey>
AllowedIPs = 10.0.0.2/32
```

## Pivoting through the tunnel

```bash
# once wg0 is up and AllowedIPs covers the target subnet:
nmap -sT 10.10.10.0/24            # scan the internal net over the VPN
ssh user@10.10.10.5              # reach hosts that were unroutable before
ip route | grep wg0              # verify what the tunnel routes
```

> WireGuard is quieter and faster than legacy VPNs but the endpoint UDP port is still fingerprintable. For egress that only allows HTTP/HTTPS, a WireGuard endpoint won't help — reach for [chisel](#/tool/chisel) or an [SSH](#/tool/ssh) `-D` SOCKS proxy instead.
