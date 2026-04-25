#!/bin/bash
# scripts/setup-github.sh
#
# One-shot GitHub setup for this bootstrap (no-product variant).
# Reads project.config.json and sets the 3 required repo secrets.
# Run once after cloning the template into a new repo.

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${BLUE}->${NC} $1"; }
done_() { echo -e "${GREEN}OK${NC} $1"; }
warn()  { echo -e "${YELLOW}!!${NC} $1"; }
fail()  { echo -e "${RED}ERR${NC} $1" >&2; exit 1; }

# --- Dependencies ---

command -v gh >/dev/null 2>&1 || fail "GitHub CLI (gh) is required. Install: https://cli.github.com"
command -v jq >/dev/null 2>&1 || fail "jq is required. Install via your package manager."
gh auth status >/dev/null 2>&1 || fail "Not logged into GitHub CLI. Run: gh auth login"

# --- Locate repo root + config ---

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG="$REPO_ROOT/project.config.json"

[ -f "$CONFIG" ] || fail "project.config.json not found at $CONFIG"

PROJECT_NAME="$(jq -r .projectName "$CONFIG")"
DISPLAY_NAME="$(jq -r .displayName "$CONFIG")"
ROOT_DOMAIN="$(jq -r .rootDomain "$CONFIG")"

[ -n "$PROJECT_NAME" ] && [ "$PROJECT_NAME" != "null" ] || fail "projectName missing from project.config.json"

echo ""
echo "========================================"
echo "  Bootstrap GitHub Setup (no-product)"
echo "========================================"
echo ""
echo "  Project:     $DISPLAY_NAME ($PROJECT_NAME)"
echo "  Root domain: $ROOT_DOMAIN"
echo ""

# --- Detect repo from git remote ---

detect_repo() {
  local url
  url="$(git -C "$REPO_ROOT" remote get-url origin 2>/dev/null || echo "")"
  [ -z "$url" ] && return

  # Handle both https and ssh remote formats
  # https://github.com/OWNER/REPO(.git)
  # git@github.com:OWNER/REPO(.git)
  echo "$url" | sed -E 's#^(https://github.com/|git@github.com:)##; s#\.git$##'
}

DETECTED_REPO="$(detect_repo)"
if [ -n "$DETECTED_REPO" ]; then
  read -rp "  GitHub repo (owner/name) [$DETECTED_REPO]: " REPO
  REPO="${REPO:-$DETECTED_REPO}"
else
  read -rp "  GitHub repo (owner/name): " REPO
fi

[ -n "$REPO" ] || fail "Repo is required."

gh repo view "$REPO" >/dev/null 2>&1 || fail "Cannot access repo '$REPO'. Check the name and your permissions."
done_ "Repo: $REPO"
echo ""

# --- Prompt for the 3 secrets ---

info "Enter AWS + Pulumi credentials (input is hidden)."
echo ""

read -rsp "  AWS Access Key ID: " AWS_KEY; echo
read -rsp "  AWS Secret Access Key: " AWS_SECRET; echo
read -rsp "  Pulumi Access Token: " PULUMI_TOKEN; echo

[ -n "$AWS_KEY" ]      || fail "AWS_ACCESS_KEY_ID is required."
[ -n "$AWS_SECRET" ]   || fail "AWS_SECRET_ACCESS_KEY is required."
[ -n "$PULUMI_TOKEN" ] || fail "PULUMI_ACCESS_TOKEN is required."

echo ""
info "Setting repo secrets..."

set_secret() {
  local name="$1" value="$2"
  echo "$value" | gh secret set "$name" --repo "$REPO" >/dev/null
  done_ "$name"
}

set_secret "AWS_ACCESS_KEY_ID"     "$AWS_KEY"
set_secret "AWS_SECRET_ACCESS_KEY" "$AWS_SECRET"
set_secret "PULUMI_ACCESS_TOKEN"   "$PULUMI_TOKEN"

echo ""
echo "========================================"
done_ "Done. CI is ready."
echo ""
echo "  Verify with:"
echo "    gh secret list --repo $REPO"
echo ""
echo "  Next steps:"
echo "    1. cd infrastructure && npm ci && pulumi stack init stage && pulumi up --stack stage"
echo "    2. git push origin stage"
echo "========================================"
echo ""
