```md
# Secrets Management & Rotation – Taly CRM

This document outlines how Taly CRM handles the secure management, storage, and rotation of secrets across all environments. It covers `.env` files, cloud secret managers (AWS SSM), and rotation policies to ensure sensitive credentials remain protected and auditable.

---

## 1. What Are Secrets?

Secrets include sensitive credentials such as:

- API keys (e.g. Stripe, Twilio)
- Database passwords
- JWT signing secrets
- OAuth client secrets
- Internal API tokens
- Webhook signing keys

---

## 2. Secret Sources by Environment

| Environment   | Method             | Tool/Service       |
|---------------|--------------------|--------------------|
| Local         | `.env.local` files | Git-ignored and developer-managed |
| Staging/Prod  | Cloud secret manager | AWS SSM Parameter Store (default) |
| CI/CD         | GitHub Actions     | Encrypted Actions secrets |

---

## 3. AWS SSM Parameter Store

### Usage

- Secrets are stored under `/taly/{env}/KEY_NAME`
- Accessed in runtime via environment injection or `aws-sdk`
- Encrypted with KMS and IAM-restricted

### Example Path

```
/taly/production/JWT_SECRET
/taly/staging/STRIPE_SECRET_KEY
```

### IAM Permissions

Services using SSM must include:

```json
{
  "Effect": "Allow",
  "Action": [
    "ssm:GetParameter",
    "ssm:GetParameters"
  ],
  "Resource": "arn:aws:ssm:*:*:parameter/taly/*"
}
```

---

## 4. GitHub Actions Secrets

Used for CI workflows (test, deploy, build).

| Example Key             | Usage                   |
|-------------------------|-------------------------|
| `DATABASE_URL`          | Run backend tests       |
| `JWT_SECRET`            | Create signed tokens    |
| `STRIPE_SECRET_KEY`     | Deploy serverless w/ Stripe |
| `AWS_ACCESS_KEY_ID`     | Deploy to Lambda/K8s    |

> Secrets should **not** be used to inject full `.env` files—inject them individually.

---

## 5. Rotation Policy

| Secret Type         | Rotation Frequency | Method               |
|---------------------|--------------------|----------------------|
| JWT signing secret  | Every 90 days      | Manual + CI update   |
| Stripe webhooks     | Every 60 days      | Portal → `.env` → SSM|
| DB credentials      | Every 180 days     | RDS rotation or Vault|
| Twilio/SES keys     | Every 90 days      | AWS Console → SSM    |

### Rotation Steps

1. Update in source (Stripe, SES, etc.)
2. Push to SSM:
   ```bash
   aws ssm put-parameter --name /taly/production/JWT_SECRET --value 'new-secret' --type SecureString --overwrite
   ```
3. Redeploy affected services
4. Invalidate previous token versions (if applicable)

---

## 6. Vault (Optional / Planned)

| Tool      | Status   | Notes                           |
|-----------|----------|---------------------------------|
| HashiCorp Vault | Future  | Use for multi-tenant secret segregation |
| AWS Secrets Manager | Considered | Expensive for low-volume use cases |

---

## 7. Secrets in Containers

- Secrets are injected into containers as **environment variables**
- Never commit `.env` files to Docker images
- Use `.dockerignore` to block local env leakage

---

## 8. Audit Logging

- All changes in SSM are logged in CloudTrail
- Planned integration with Alerting (Slack/Email) for:
  - Rotation overdue
  - Secrets accessed outside deployment
  - Unknown IAM actor access

---

## 9. Best Practices

✅ Use environment-specific paths (e.g. `/taly/staging/...`)  
✅ Limit IAM read access to exact paths  
✅ Rotate secrets manually and confirm redeploy  
✅ Never commit secrets to GitHub (even encrypted)  
✅ Use test secrets in CI, not production credentials  

---

## 10. Related Files

| File                      | Purpose                          |
|---------------------------|----------------------------------|
| `.env.example`            | Developer reference only         |
| `config/configuration.ts`| Validates required secrets       |
| `serverless.yml`          | Injects secrets into Lambda      |
| `k8s/secrets.yaml`        | Staging secrets (development only) |
| GitHub: Settings → Secrets| CI/CD level secrets              |

---

## 11. Questions?

- Slack: `#taly-devops`
- Email: `infra@taly.dev`

---
```
