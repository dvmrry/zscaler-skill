#!/usr/bin/env bash
# splunk-query.sh — run a named SPL pattern from references/shared/splunk-queries.md.
#
# Status: STUB. Implement for your SIEM per the notes below.
# Real implementation: use the vendored splunk-sdk-python
# (vendor/splunk-sdk-python) to submit a search job and stream results as JSON.
#
# Auth — reads from environment variables. Never commit credentials.
#   SPLUNK_HOST
#   SPLUNK_PORT              (default 8089)
#   SPLUNK_TOKEN             (preferred: HEC / auth token)
#   SPLUNK_USERNAME          (legacy: user+pass)
#   SPLUNK_PASSWORD
#
# Index naming — tenant-portable via env vars, defaults match the Zscaler
# Splunk Technology Add-on out of the box. Set to override on non-default
# naming. See references/shared/splunk-queries.md § "Tenant-portable index
# naming" and clarification shared-01.
#   SPLUNK_INDEX_ZIA_WEB     (default: zscaler_web)
#   SPLUNK_INDEX_ZIA_FW      (default: zscaler_firewall)
#   SPLUNK_INDEX_ZIA_DNS     (default: zscaler_dns)
#   SPLUNK_INDEX_ZPA         (default: zscaler_zpa)
#
# Usage:
#   ./scripts/splunk-query.sh <pattern-name> [key=value ...]
# Example:
#   ./scripts/splunk-query.sh url-coverage-check URL=www.reddit.com

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: $0 <pattern-name> [key=value ...]" >&2
  echo "  pattern-name: section in references/shared/splunk-queries.md" >&2
  exit 2
fi

PATTERN="$1"; shift

echo "splunk-query.sh: stub — not implemented." >&2
echo "  pattern: ${PATTERN}" >&2
echo "  args: $*" >&2
echo "  would use: vendor/splunk-sdk-python via uv run (TBD)" >&2

# TODO: read the named pattern from references/shared/splunk-queries.md
# TODO: substitute $VARS from args and env
# TODO: submit via splunk-sdk-python, stream JSON to stdout
# TODO: cache to logs/<pattern-name>-<timestamp>.json for reproducibility

exit 0
