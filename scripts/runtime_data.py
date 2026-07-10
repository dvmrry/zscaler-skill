"""Runtime-data mount path helpers for Python scripts.

The public template defaults to ``_data``. Installs may select a committed
non-secret runtime config and may locally override it from a selected setup
config. Config paths and mount/tracking strings are expanded here; private
source URLs in setup config are deliberately left unread by callers that only
need local output paths.
"""

from __future__ import annotations

import json
import os
import posixpath
import re
from pathlib import Path
from typing import Any

DEFAULT_DATA_MOUNT = "_data"
DEFAULT_RUNTIME_DATA_TRACKING = "ignored"
RUNTIME_CONFIG_FILE = "zscaler-skill-runtime.json"
SETUP_CONFIG_FILE = "zscaler-skill-setup.json"
RUNTIME_CONFIG_ENV = "ZSCALER_SKILL_RUNTIME_CONFIG"
SETUP_CONFIG_ENV = "ZSCALER_SKILL_SETUP_CONFIG"
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


def _read_json_object(config_path: Path) -> dict[str, Any]:
    if not config_path.exists():
        return {}
    parsed = json.loads(config_path.read_text(encoding="utf-8"))
    if not isinstance(parsed, dict):
        raise RuntimeError(f"config must be a JSON object: {config_path}")
    return parsed


def _object_config(value: Any, label: str) -> dict[str, Any]:
    if value is None:
        return {}
    if isinstance(value, dict):
        return value
    raise RuntimeError(f"{label} must be a JSON object")


def normalize_runtime_data_tracking(value: Any = DEFAULT_RUNTIME_DATA_TRACKING) -> str:
    tracking = DEFAULT_RUNTIME_DATA_TRACKING if value is None else value
    if tracking not in {"ignored", "tracked"}:
        raise RuntimeError("runtime data tracking must be one of: ignored, tracked")
    return tracking


def _first_configured(*values: Any, default: Any) -> Any:
    for value in values:
        if value is not None:
            return value
    return default


def _selected_config_path(
    root: Path,
    option_value: str | Path | None,
    env_name: str,
    default_file: str,
    env: dict[str, str],
) -> tuple[Path, str]:
    configured_option = str(option_value).strip() if option_value is not None else ""
    env_value = env.get(env_name, "").strip()
    selected = configured_option or env_value
    if selected:
        expanded = expand_config_string(selected, env)
        candidate = Path(expanded)
        config_path = candidate if candidate.is_absolute() else root / candidate
        config_path = config_path.resolve()
        if not candidate.is_absolute() and not config_path.is_relative_to(root.resolve()):
            raise RuntimeError(
                f"{env_name} or explicit relative config path must stay inside the repo: {selected}"
            )
        if not config_path.exists():
            raise RuntimeError(
                f"{env_name} or explicit config path selects a missing file: {config_path}"
            )
        return config_path, "option" if configured_option else env_name
    return root / default_file, "default"


def runtime_data_mount_settings(
    root: Path = REPO_ROOT,
    *,
    runtime_config_path: str | Path | None = None,
    setup_config_path: str | Path | None = None,
    env: dict[str, str] | None = None,
) -> dict[str, Any]:
    source = os.environ if env is None else env
    runtime_path, runtime_selected_by = _selected_config_path(
        root, runtime_config_path, RUNTIME_CONFIG_ENV, RUNTIME_CONFIG_FILE, source
    )
    setup_path, setup_selected_by = _selected_config_path(
        root, setup_config_path, SETUP_CONFIG_ENV, SETUP_CONFIG_FILE, source
    )
    runtime_config = _read_json_object(runtime_path)
    setup_config = _read_json_object(setup_path)
    runtime_data = _object_config(
        runtime_config.get("runtimeData"), f"{runtime_path}: runtimeData"
    )
    setup_runtime_data = _object_config(
        setup_config.get("runtimeData"), f"{setup_path}: runtimeData"
    )

    configured_mount = _first_configured(
        setup_runtime_data.get("mountPath"),
        setup_config.get("mountPath"),
        runtime_data.get("mountPath"),
        runtime_config.get("mountPath"),
        default=DEFAULT_DATA_MOUNT,
    )
    configured_tracking = _first_configured(
        setup_runtime_data.get("tracking"),
        setup_config.get("tracking"),
        runtime_data.get("tracking"),
        runtime_config.get("tracking"),
        default=DEFAULT_RUNTIME_DATA_TRACKING,
    )

    if isinstance(configured_mount, str):
        configured_mount = expand_config_string(configured_mount, source)
    if isinstance(configured_tracking, str):
        configured_tracking = expand_config_string(configured_tracking, source)

    return {
        "mountPath": normalize_mount_path(configured_mount),
        "tracking": normalize_runtime_data_tracking(configured_tracking),
        "runtimeConfigPath": str(runtime_path),
        "setupConfigPath": str(setup_path),
        "runtimeConfigSelectedBy": runtime_selected_by,
        "setupConfigSelectedBy": setup_selected_by,
    }


def runtime_data_mount_path(
    root: Path = REPO_ROOT,
    *,
    runtime_config_path: str | Path | None = None,
    setup_config_path: str | Path | None = None,
    env: dict[str, str] | None = None,
) -> str:
    return str(
        runtime_data_mount_settings(
            root,
            runtime_config_path=runtime_config_path,
            setup_config_path=setup_config_path,
            env=env,
        )["mountPath"]
    )


def runtime_data_path(
    *segments: str,
    root: Path = REPO_ROOT,
    runtime_config_path: str | Path | None = None,
    setup_config_path: str | Path | None = None,
    env: dict[str, str] | None = None,
) -> Path:
    return root / runtime_data_mount_path(
        root,
        runtime_config_path=runtime_config_path,
        setup_config_path=setup_config_path,
        env=env,
    ) / Path(*segments)
