```md
# Kubernetes Deployment Guide – Taly CRM

This guide explains how to deploy and manage the Taly CRM system in a **Kubernetes environment**, covering deployment manifests, service architecture, scaling, and production-grade recommendations. It supports environments like **AWS EKS**, **GKE**, or **local Minikube**.

---

## 1. Overview

| Component       | Type           | Deployment Target     |
|----------------|----------------|------------------------|
| API Backend     | NestJS         | `Deployment + Service` |
| Dashboard App   | Next.js (SSR)  | `Deployment + Ingress` |
| Booking App     | Static SPA     | `S3 or Deployment`     |
| PostgreSQL DB   | StatefulSet    | `Managed or PVC-based` |
| Serverless Fns  | External       | `Lambda / Knative`     |

---

## 2. Directory Structure

```
devops/k8s/
├── base/
│   ├── api-deployment.yaml
│   ├── dashboard-deployment.yaml
│   ├── ingress.yaml
│   ├── postgres-statefulset.yaml
│   ├── secrets.yaml
│   └── configmap.yaml
├── overlays/
│   ├── production/
│   └── staging/
```

> Supports **Kustomize** for environment overlays.

---

## 3. Backend Deployment (`api-deployment.yaml`)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: taly-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: taly-api
  template:
    metadata:
      labels:
        app: taly-api
    spec:
      containers:
        - name: api
          image: ghcr.io/taly-crm/api:latest
          ports:
            - containerPort: 4000
          envFrom:
            - secretRef:
                name: api-secrets
            - configMapRef:
                name: api-config
```

---

## 4. Dashboard Deployment (`dashboard-deployment.yaml`)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: taly-dashboard
spec:
  replicas: 2
  selector:
    matchLabels:
      app: taly-dashboard
  template:
    metadata:
      labels:
        app: taly-dashboard
    spec:
      containers:
        - name: dashboard
          image: ghcr.io/taly-crm/dashboard:latest
          ports:
            - containerPort: 3000
```

---

## 5. PostgreSQL StatefulSet (`postgres-statefulset.yaml`)

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:15-alpine
          ports:
            - containerPort: 5432
          volumeMounts:
            - name: pgdata
              mountPath: /var/lib/postgresql/data
          env:
            - name: POSTGRES_DB
              value: taly
            - name: POSTGRES_USER
              valueFrom:
                secretKeyRef:
                  name: db-secrets
                  key: POSTGRES_USER
```

---

## 6. Ingress (Nginx or Cloud-specific)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: taly-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: dashboard.taly.dev
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: taly-dashboard
                port:
                  number: 3000
    - host: api.taly.dev
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: taly-api
                port:
                  number: 4000
```

---

## 7. Secrets & Config

- Stored as Kubernetes `Secret` and `ConfigMap`
- Managed via GitOps (SealedSecrets, SOPS) or CLI

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: api-secrets
type: Opaque
data:
  JWT_SECRET: base64-encoded-value
```

---

## 8. Local Development with Minikube

```bash
minikube start
kubectl apply -k devops/k8s/overlays/local
minikube tunnel
```

Test services:
```bash
kubectl port-forward svc/taly-api 4000:4000
kubectl port-forward svc/taly-dashboard 3000:3000
```

---

## 9. Production Recommendations

| Feature                  | Recommended Tool      |
|--------------------------|------------------------|
| TLS Certificate          | cert-manager + ACME   |
| Horizontal Autoscaling   | HPA based on CPU/RPS  |
| Log Aggregation          | Loki or CloudWatch    |
| Metrics                  | Prometheus + Grafana  |
| Secrets Rotation         | External secrets store (e.g. SSM) |
| Blue/Green Deployments   | Argo Rollouts         |

---

## 10. Monitoring & Alerts

Planned integrations:
- Prometheus scrape targets for API/DB
- Grafana dashboards for bookings, payments
- Alert rules via AlertManager + Slack

---

## 11. Serverless Integration (External)

- Deployed separately to AWS Lambda via `serverless.yml`
- Optionally replaced with **Knative** or **KEDA** in future
- Exposed via `api-gateway` or `/lambda/*` routes

---

## 12. Related Files

| File                             | Purpose                              |
|----------------------------------|--------------------------------------|
| `api-deployment.yaml`           | API backend in Kubernetes            |
| `dashboard-deployment.yaml`     | Next.js app in container             |
| `postgres-statefulset.yaml`     | Persistent DB layer                  |
| `ingress.yaml`                  | Routes traffic to dashboard + API    |
| `secrets.yaml`, `configmap.yaml`| Env variables and secure configs     |

---

## 13. Questions?

- Slack: `#taly-devops`
- Email: `infra@taly.dev`

---
```