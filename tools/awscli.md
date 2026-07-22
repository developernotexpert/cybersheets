---
name: AWS CLI
category: Cloud
description: Interact with AWS from the terminal — enumerate and test cloud access.
tags: [aws, cloud, s3, iam, enumeration, cli]
---

# AWS CLI

The **AWS CLI** drives Amazon Web Services from the command line. In security work it's how you enumerate what a set of credentials or keys can reach — S3 buckets, IAM permissions, instances — and confirm misconfigurations.

> `pip install awscli` · `apt install awscli` · [aws.amazon.com/cli](https://aws.amazon.com/cli/)

## Configure credentials

```bash
aws configure                          # interactive: key, secret, region
aws configure --profile target          # named profile
# or use env vars:
export AWS_ACCESS_KEY_ID=AKIA...
export AWS_SECRET_ACCESS_KEY=...
export AWS_DEFAULT_REGION=us-east-1
```

## Who am I? (first thing to run)

```bash
aws sts get-caller-identity            # account ID, user/role ARN
aws sts get-caller-identity --profile target
```

## S3 enumeration

```bash
aws s3 ls                              # buckets you can list
aws s3 ls s3://bucket-name             # objects in a bucket
aws s3 ls s3://bucket-name --no-sign-request     # try anonymous access
aws s3 cp s3://bucket-name/file.txt .            # download
aws s3 sync s3://bucket-name ./loot              # pull everything
```

## IAM — what can these creds do?

```bash
aws iam get-user
aws iam list-users
aws iam list-attached-user-policies --user-name bob
aws iam list-user-policies --user-name bob
aws iam list-roles
```

## Compute / secrets worth checking

```bash
aws ec2 describe-instances --query 'Reservations[].Instances[].[InstanceId,PublicIpAddress]' --output table
aws ec2 describe-security-groups
aws secretsmanager list-secrets
aws ssm describe-parameters
aws lambda list-functions
```

## Handy flags

```bash
aws s3 ls --output json | jq .          # JSON + jq for scripting
aws ec2 describe-instances --region eu-west-1
aws --endpoint-url http://localhost:4566 s3 ls   # LocalStack / custom endpoints
```

> `get-caller-identity` then IAM/S3 enumeration is the standard "what do these keys unlock?" flow. Pipe JSON output through [jq](#/tool/jq). For automated cloud auditing, tools like ScoutSuite, Prowler and Pacu build on top of this.
