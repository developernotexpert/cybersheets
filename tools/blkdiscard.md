---
name: blkdiscard
category: Forensics & Reverse Engineering
description: Send TRIM/Secure Erase commands to SSDs and NVMe — the correct way to wipe flash storage.
tags: [blkdiscard, ssd, nvme, trim, secure-erase, wipe, anti-forensics, data-destruction]
---

# blkdiscard

**blkdiscard** envia comandos DISCARD (TRIM) ou Secure Erase diretamente ao firmware de dispositivos de bloco. É a forma correta de apagar SSDs e NVMe, onde ferramentas de overwrite como [shred](#/tool/shred) são ineficazes por causa do wear leveling.

> part of `util-linux` (pre-installed on most Linux) · `man blkdiscard`

## Basic usage

```bash
blkdiscard /dev/sda                   # TRIM — marca todos os blocos como livres
blkdiscard /dev/nvme0n1               # TRIM em NVMe
blkdiscard /dev/nvme0n1p2             # TRIM em uma partição específica
```

## Secure Erase

```bash
blkdiscard --secure /dev/nvme0n1      # Secure Erase — força o firmware a zerar todas as células
blkdiscard --secure /dev/sda          # Secure Erase em SSD SATA
```

`--secure` envia o comando ATA Secure Erase (SATA) ou NVMe Sanitize, que apaga inclusive blocos de over-provisioning inacessíveis pelo sistema operacional. Nem todo dispositivo suporta — se falhar, o firmware não implementa.

## Useful options

| Option | Purpose |
|--------|---------|
| `--secure` | Secure Erase — garante destruição no nível do firmware |
| `--zeroout` | Escreve zeros ao invés de enviar DISCARD |
| `-o OFFSET` | Começar a partir de um offset em bytes |
| `-l LENGTH` | Descartar apenas LENGTH bytes |
| `-f` | Forçar — descartar mesmo se o dispositivo estiver montado (perigoso) |
| `-v` | Verbose — mostra progresso |

## Common patterns

```bash
# Wipe completo de NVMe antes de descarte/venda
blkdiscard --secure -v /dev/nvme0n1

# Fallback se --secure não for suportado
blkdiscard -v /dev/nvme0n1

# Zerar um SSD (alternativa se DISCARD não for suportado)
blkdiscard --zeroout -v /dev/sda

# Wipe parcial — primeiros 10GB
blkdiscard -l 10G /dev/nvme0n1

# Verificar se o dispositivo suporta Secure Erase (NVMe)
nvme id-ctrl /dev/nvme0n1 | grep -i sanicap
```

## NVMe Sanitize (alternativa)

Se `blkdiscard --secure` falhar, o `nvme-cli` oferece controle mais granular:

```bash
# Block Erase (mais rápido)
nvme sanitize /dev/nvme0n1 -a 2

# Crypto Erase (se o drive suportar criptografia interna)
nvme sanitize /dev/nvme0n1 -a 4

# Verificar progresso
nvme sanitize-log /dev/nvme0n1
```

## Limitações

```text
⚠ blkdiscard opera em dispositivos de bloco inteiros ou partições — não em arquivos individuais.
⚠ --secure depende do firmware: se o fabricante implementou mal, os dados podem não ser realmente apagados.
⚠ Requer que o dispositivo esteja desmontado (ou use -f, por sua conta e risco).
⚠ Não funciona em WSL — precisa de acesso direto ao hardware.
⚠ Em RAID por hardware, o comando pode não chegar ao disco real.
```

> Para arquivos individuais em HDD use [shred](#/tool/shred) ou [secure-delete](#/tool/secure-delete). Para destruição de dados em qualquer tipo de storage, criptografia full-disk (LUKS) + destruição da chave é a abordagem mais confiável.
