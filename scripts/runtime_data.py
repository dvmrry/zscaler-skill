"""Runtime-data mount path helpers for Python scripts.

The public template defaults to ``_data``. Local installs may set
``runtimeData.mountPath`` in the ignored root ``zscaler-skill-setup.json``.
Only the mount path is expanded here; private source URLs in the same config
are deliberately left unread by callers that only need local output paths.
"""

from __future__ import annotations

import json
import os
import posixpath
import re
from pathlib import Path
from typing import Any

DEFAULT_DATA_MOUNT = "_data"
REPO_ROOT = Path(__file__).resolve().parent.parent
_ENV_RE = re.compile(r"\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)")


def expand_config_string(value: str, env: dict[str, str] | None = None) -> str:
    source = os.environ if env is None else env

    def replace(match: re.Match[str]) -> str:
        name = match.group(1) or match.group(2)
        if name not in source:
            raise RuntimeError(f"environment variable {name} is not set for config value {match.group(0)}")
        return source[name]

    return _ENV_RE.sub(replace, value)


def normalize_mount_path(value: Any = DEFAULT_DATA_MOUNT) -> str:
    if not isinstance(value, str) or not value.strip():
        raise RuntimeError("runtime data mount path must be a non-empty string")
    raw = value.strip().replace("\\", "/")
    if raw.startswith("/"):
        raise RuntimeError(f"runtime data mount path must be relative: {value}")
    if ".." in raw.split("/"):
        raise RuntimeError(f"runtime data mount path must not contain '..': {value}")
    normalized = posixpath.normpath(raw).rstrip("/")
    if normalized in {"", ".", ".."} or normalized.startswith("../"):
        raise RuntimeError(f"runtime data mount path must stay inside the repo: {value}")
    if normalized.startswith("-"):
        raise RuntimeError(f"runtime data mount path must not start with '-': {value}")
    if normalized == ".git" or normalized.startswith(".git/"):
        raise RuntimeError("runtime data mount path must not be inside .git")
    return normalized


def _read_root_config(root: Path) -> dict[str, Any]:
    config_path = root / "zscaler-skill-setup.json"
    if not config_path.exists():
        return {}
    parsed = json.loads(config_path.read_text(encoding="utf-8"))
    if not isinstance(parsed, dict):
        raise RuntimeError(f"config must be a JSON object: {config_path}")
    return parsed


def runtime_data_mount_path(root: Path = REPO_ROOT) -> str:
    config = _read_root_config(root)
    runtime_data = config.get("runtimeData") if isinstance(config.get("runtimeData"), dict) else {}
    configured = runtime_data.get("mountPath", config.get("mountPath", DEFAULT_DATA_MOUNT))
    if isinstance(configured, str):
        configured = expand_config_string(configured)
    return normalize_mount_path(configured)


def runtime_data_path(*segments: str, root: Path = REPO_ROOT) -> Path:
    return root / runtime_data_mount_path(root) / Path(*segments)
