---
name: secure-delete
category: Forensics & Reverse Engineering
description: Suite of 4 tools for secure wiping of files, free space, RAM, and swap.
tags: [secure-delete, srm, sfill, sdmem, sswap, wipe, anti-forensics, data-destruction]
---

# secure-delete

**secure-delete** é um pacote com 4 ferramentas de destruição segura de dados: `srm` (arquivos), `sfill` (espaço livre), `sdmem` (memória RAM) e `sswap` (swap). Cobre mais superfícies que o [shred](#/tool/shred) sozinho.

> `apt install secure-delete` · funciona em HDD — em SSD/NVMe, prefira [blkdiscard](#/tool/blkdiscard)

---

## srm — Secure Remove

Remove arquivos sobrescrevendo com múltiplos padrões antes de deletar. Suporta recursão nativa (diferente do shred).

```bash
srm secret.txt                        # wipe + delete (38 passes — Gutmann)
srm -v secret.txt                     # verbose
srm -z secret.txt                     # last pass with zeros (hide shredding)
srm -r /path/to/dir/                  # recursivo — apaga diretório inteiro
srm -ll secret.txt                    # modo rápido: 2 passes (random + random)
srm -l secret.txt                     # modo médio: 2 passes (random + Gutmann lite)
```

### Opções do srm

| Option | Purpose |
|--------|---------|
| `-r` | Recursivo — processa diretórios |
| `-v` | Verbose |
| `-z` | Passe final com zeros |
| `-l` | Modo menos seguro (2 passes) — mais rápido |
| `-ll` | Modo rápido (2 passes de random apenas) |
| `-f` | Força — não pede confirmação |

---

## sfill — Secure Free Space Wipe

Preenche todo o espaço livre de uma partição com dados aleatórios e depois apaga. Útil depois de deletar arquivos normalmente — elimina resíduos recuperáveis.

```bash
sfill -v /home                        # wipe do espaço livre em /home
sfill -z /tmp                         # wipe + passe final de zeros
sfill -ll /home                       # modo rápido
sfill -v /                            # wipe de todo espaço livre no /
```

### Opções do sfill

| Option | Purpose |
|--------|---------|
| `-v` | Verbose |
| `-z` | Passe final com zeros |
| `-l` / `-ll` | Modos mais rápidos (menos passes) |
| `-i` | Wipe apenas inodes livres (não o espaço de dados) |

---

## sdmem — Secure Memory Wipe

Sobrescreve toda a RAM livre com dados aleatórios. Previne ataques de cold boot e extração de chaves criptográficas da memória.

```bash
sdmem -v                              # wipe da RAM (demorado — Gutmann 38 passes)
sdmem -ll                             # modo rápido — 2 passes
sdmem -llv                            # rápido + verbose
```

### Opções do sdmem

| Option | Purpose |
|--------|---------|
| `-v` | Verbose |
| `-l` / `-ll` | Modos mais rápidos |

---

## sswap — Secure Swap Wipe

Sobrescreve a partição de swap. Swap pode conter senhas, chaves e dados sensíveis que estavam em RAM.

```bash
# Desativar swap, wipe, reativar
sudo swapoff /dev/sda2
sudo sswap -v /dev/sda2
sudo swapon /dev/sda2

# Modo rápido
sudo swapoff /dev/sda2
sudo sswap -ll /dev/sda2
sudo swapon /dev/sda2
```

O swap **precisa** estar desativado antes do wipe.

---

## Recipes

```bash
# Workflow completo de limpeza pós-incidente (HDD)
srm -rv /var/log/compromised/         # apaga logs do atacante
sfill -llv /var                       # limpa espaço livre
sudo swapoff -a && sudo sswap -ll /dev/sda2 && sudo swapon -a
sdmem -ll                             # limpa RAM

# Apagar home de um usuário removido
srm -rfv /home/exuser/
sfill -llv /home/

# Wipe rápido de arquivos temporários sensíveis
srm -llz /tmp/decrypted_*
```

## Limitações

```text
⚠ Mesmas limitações do shred em SSD/NVMe — wear leveling torna overwrite ineficaz.
⚠ sfill precisa de espaço para criar arquivos temporários — disco 100% cheio impede o funcionamento.
⚠ sdmem pode demorar vários minutos em sistemas com muita RAM (modo Gutmann).
⚠ Não funciona em filesystems copy-on-write (Btrfs, ZFS) — snapshots retêm dados antigos.
⚠ sswap requer swap desativado — interrompe o sistema temporariamente.
```

> Para SSD/NVMe, use [blkdiscard](#/tool/blkdiscard). Para arquivos individuais em HDD quando não quiser instalar nada extra, [shred](#/tool/shred) resolve. A abordagem mais robusta independente de hardware é criptografia full-disk (LUKS) + destruição da chave.
