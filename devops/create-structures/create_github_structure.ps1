# Create directories for GitHub actions
New-Item -ItemType Directory -Path ".github/workflows" -Force
New-Item -ItemType Directory -Path ".github/ISSUE_TEMPLATE" -Force

# Create files for GitHub workflows
New-Item -ItemType File -Path ".github/workflows/backend-ci.yml"
New-Item -ItemType File -Path ".github/workflows/frontend-ci.yml"
New-Item -ItemType File -Path ".github/workflows/serverless-ci.yml"
New-Item -ItemType File -Path ".github/workflows/database-migration.yml"
New-Item -ItemType File -Path ".github/workflows/security-scan.yml"
New-Item -ItemType File -Path ".github/workflows/nightly-build.yml"

# Create files for issue templates
New-Item -ItemType File -Path ".github/ISSUE_TEMPLATE/bug_report.md"
New-Item -ItemType File -Path ".github/ISSUE_TEMPLATE/feature_request.md"

# Create other GitHub configuration files
New-Item -ItemType File -Path ".github/PULL_REQUEST_TEMPLATE.md"
New-Item -ItemType File -Path ".github/CODEOWNERS.md"
New-Item -ItemType File -Path ".github/dependabot.yml"
New-Item -ItemType File -Path ".github/README.md"