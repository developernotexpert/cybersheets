---
name: Database Commands
category: Cheatsheets & Playbooks
description: Quick reference for MSSQL, PostgreSQL, MySQL and Oracle — version, users, tables, columns and password hashes.
tags: [database, mssql, postgres, mysql, oracle, sql, RTFM]
---

# Database Commands

Enumeration queries for MSSQL, PostgreSQL, MySQL and Oracle.

## MSSQL

```sql
SELECT @@version;                                    -- DB version
EXEC xp_msver;                                       -- Detailed version
EXEC master..xp_cmdshell 'net user';                 -- Run OS command
SELECT HOST_NAME();                                  -- Hostname
SELECT DB_NAME();                                    -- Current DB
SELECT name FROM master..sysdatabases;               -- List DBs
SELECT user_name();                                  -- Current user
SELECT name FROM master..syslogins;                  -- List users
SELECT name FROM master..sysobjects WHERE xtype='U'; -- List tables
SELECT name, password_hash FROM master.sys.sql_logins; -- Password hashes
```

## PostgreSQL

```sql
SELECT version();                       -- DB version
SELECT inet_server_addr();              -- Hostname & IP
SELECT current_database();              -- Current DB
SELECT datname FROM pg_database;        -- List DBs
SELECT user;                            -- Current user
SELECT username FROM pg_user;           -- List users
SELECT username,passwd FROM pg_shadow;  -- Password hashes
```

## MySQL

```sql
SELECT @@version;                       -- DB version
SELECT @@hostname;                      -- Hostname
SELECT database();                      -- Current DB
SELECT distinct(db) FROM mysql.db;      -- List DBs
SELECT user();                          -- Current user
SELECT user FROM mysql.user;            -- List users
SELECT host,user,password FROM mysql.user; -- Password hashes
```

## Oracle

```sql
SELECT * FROM v$version;                        -- DB version
SELECT instance_name FROM v$instance;           -- Current DB
SELECT DISTINCT owner FROM all_tables;          -- List DBs
SELECT user FROM dual;                          -- Current user
SELECT username FROM all_users ORDER BY username; -- List users
SELECT table_name FROM all_tables;              -- List tables
SELECT column_name FROM all_tab_columns;        -- List columns
SELECT name, password, astatus FROM sys.user$;  -- Password hashes
SELECT DISTINCT grantee FROM dba_sys_privs WHERE ADMIN_OPTION = 'YES'; -- List DBAs
```

> Source: RTFM — Red Team Field Manual v2. See also [sqlmap](#/tool/sqlmap) and [SQL Injection](#/tool/sqli).
