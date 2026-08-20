---
name: Regex & ASCII
category: Cheatsheets & Playbooks
description: Regular expression syntax reference and ASCII/hex conversion table.
tags: [regex, ascii, hex, reference, RTFM]
---

# Regex & ASCII

Quick reference for regex expressions and ASCII table.

## Regex expressions

| Pattern | Meaning |
|---------|---------|
| `^` | Start of string |
| `$` | End of string |
| `.` | Any char but \n |
| `*` | 0 or more |
| `+` | 1 or more |
| `?` | 0 or 1 |
| `{3}` | Exactly 3 |
| `{3,}` | 3 or more |
| `{3,5}` | 3 to 5 |
| `[345]` | 3 or 4 or 5 |
| `[^34]` | Not 3 or 4 |
| `[a-z]` | Lowercase a-z |
| `[A-Z]` | Uppercase A-Z |
| `[0-9]` | Digit 0-9 |
| `\d` | Digit |
| `\D` | Not digit |
| `\w` | Word char (A-Z,a-z,0-9,_) |
| `\W` | Not word char |
| `\s` | Whitespace |
| `\S` | Not whitespace |

## Examples

| Pattern | Matches |
|---------|---------|
| `reg[ex]` | "rege" or "regx" |
| `regex?` | "rege" or "regex" |
| `regex*` | "rege" with 0+ x |
| `[Rr]egex` | "Regex" or "regex" |
| `\d{3}` | Exactly 3 digits |
| `[aeiou]` | Any 1 vowel |
| `(0[3-9]\|1[0-9]\|2[0-5])` | Numbers 03-25 |

## ASCII table (common)

| Hex | Char | Hex | Char | Hex | Char |
|-----|------|-----|------|-----|------|
| x20 | SPC | x30 | 0 | x41 | A |
| x21 | ! | x31 | 1 | x42 | B |
| x22 | " | x32 | 2 | x43 | C |
| x23 | # | x33 | 3 | x44 | D |
| x24 | $ | x34 | 4 | x45 | E |
| x25 | % | x35 | 5 | x46 | F |
| x26 | & | x36 | 6 | x47-x5a | G-Z |
| x27 | ' | x37 | 7 | x61 | a |
| x28 | ( | x38 | 8 | x62 | b |
| x29 | ) | x39 | 9 | x63-x7a | c-z |
| x2a | * | x3a | : | | |
| x2b | + | x3b | ; | | |
| x2c | , | x3c | < | | |
| x2d | - | x3d | = | | |
| x2e | . | x3e | > | | |
| x2f | / | x3f | ? | | |

> Source: RTFM — Red Team Field Manual v2
