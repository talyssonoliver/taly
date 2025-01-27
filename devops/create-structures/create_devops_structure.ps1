# Create directories for devops
New-Item -ItemType Directory -Path "devops/ci-cd" -Force
New-Item -ItemType Directory -Path "devops/k8s/deployments" -Force
New-Item -ItemType Directory -Path "devops/k8s/services" -Force
New-Item -ItemType Directory -Path "devops/docker" -Force
New-Item -ItemType Directory -Path "devops/terraform" -Force
New-Item -ItemType Directory -Path "devops/monitoring" -Force
New-Item -ItemType Directory -Path "devops/security" -Force
New-Item -ItemType Directory -Path "devops/logs" -Force
New-Item -ItemType Directory -Path "devops/cache" -Force
New-Item -ItemType Directory -Path "devops/scripts/terraform" -Force

# Create files for ci-cd
New-Item -ItemType File -Path "devops/ci-cd/backend-pipeline.yml"
New-Item -ItemType File -Path "devops/ci-cd/frontend-pipeline.yml"
New-Item -ItemType File -Path "devops/ci-cd/serverless-pipeline.yml"
New-Item -ItemType File -Path "devops/ci-cd/database-pipeline.yml"
New-Item -ItemType File -Path "devops/ci-cd/nightly-build.yml"
New-Item -ItemType File -Path "devops/ci-cd/README.md"

# Create files for k8s deployments and services
New-Item -ItemType File -Path "devops/k8s/deployments/auth-deployment.yml"
New-Item -ItemType File -Path "devops/k8s/deployments/booking-deployment.yml"
New-Item -ItemType File -Path "devops/k8s/deployments/payment-deployment.yml"
New-Item -ItemType File -Path "devops/k8s/deployments/event-bus-deployment.yml"
New-Item -ItemType File -Path "devops/k8s/services/auth-service.yml"
New-Item -ItemType File -Path "devops/k8s/services/booking-service.yml"
New-Item -ItemType File -Path "devops/k8s/services/payment-service.yml"
New-Item -ItemType File -Path "devops/k8s/services/event-bus-service.yml"
New-Item -ItemType File -Path "devops/k8s/ingress.yml"
New-Item -ItemType File -Path "devops/k8s/redis-deployment.yml"
New-Item -ItemType File -Path "devops/k8s/postgres-deployment.yml"
New-Item -ItemType File -Path "devops/k8s/secrets.yml"

# Create files for docker
New-Item -ItemType File -Path "devops/docker/auth-service.dockerfile"
New-Item -ItemType File -Path "devops/docker/booking-service.dockerfile"
New-Item -ItemType File -Path "devops/docker/payment-service.dockerfile"
New-Item -ItemType File -Path "devops/docker/notification-service.dockerfile"
New-Item -ItemType File -Path "devops/docker/message-broker.dockerfile"

# Create files for terraform
New-Item -ItemType File -Path "devops/terraform/auth-service.tf"
New-Item -ItemType File -Path "devops/terraform/booking-service.tf"
New-Item -ItemType File -Path "devops/terraform/s3.tf"
New-Item -ItemType File -Path "devops/terraform/cloudfront.tf"
New-Item -ItemType File -Path "devops/terraform/rds.tf"
New-Item -ItemType File -Path "devops/terraform/outputs.tf"

# Create files for monitoring
New-Item -ItemType File -Path "devops/monitoring/prometheus-config.yml"
New-Item -ItemType File -Path "devops/monitoring/grafana-dashboard.json"
New-Item -ItemType File -Path "devops/monitoring/alertmanager.yml"

# Create files for security
New-Item -ItemType File -Path "devops/security/snyk-config.json"
New-Item -ItemType File -Path "devops/security/oauth-config.yml"
New-Item -ItemType File -Path "devops/security/jwt-config.yml"
New-Item -ItemType File -Path "devops/security/firewall-rules.txt"
New-Item -ItemType File -Path "devops/security/network-policy.yml"
New-Item -ItemType File -Path "devops/security/vulnerability-scanner.yml"
New-Item -ItemType File -Path "devops/security/auditor.yml"
New-Item -ItemType File -Path "devops/security/README.md"

# Create files for logs
New-Item -ItemType File -Path "devops/logs/logstash-config.yml"
New-Item -ItemType File -Path "devops/logs/kibana-dashboard.json"
New-Item -ItemType File -Path "devops/logs/filebeat-config.yml"

# Create files for cache
New-Item -ItemType File -Path "devops/cache/redis-config.yml"
New-Item -ItemType File -Path "devops/cache/memcached-config.yml"

# Create files for scripts
New-Item -ItemType File -Path "devops/scripts/deploy.sh"
New-Item -ItemType File -Path "devops/scripts/backup-db.sh"
New-Item -ItemType File -Path "devops/scripts/clean-containers.sh"
New-Item -ItemType File -Path "devops/scripts/run-tests.sh"
New-Item -ItemType File -Path "devops/scripts/README.md"

# Create README file for devops
New-Item -ItemType File -Path "devops/README.md"