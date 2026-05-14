"""Runtime guard for scripts that require private tenant validation.

The public repo keeps some live-API workflow sketches as implementation
templates. They should not run by default because their SDK response handling
has not been validated against a real tenant.
"""

from __future__ import annotations

import argparse
import sys


def add_scaffold_arg(parser: argparse.ArgumentParser) -> None:
    parser.add_argument(
        "--allow-scaffold",
        action="store_true",
        help=(
            "Run this unvalidated private-overlay scaffold. The output is not "
            "trustworthy until the TODOs are completed against real tenant data."
        ),
    )


def guard_scaffold(args: argparse.Namespace, script_name: str, reason: str) -> None:
    if getattr(args, "allow_scaffold", False):
        print(
            f"WARN: {script_name} is an unvalidated private-overlay scaffold; "
            "output may be incomplete or wrong.",
            file=sys.stderr,
        )
        return

    print(
        f"ERROR: {script_name} is a private-overlay scaffold, not a public "
        "operational script.",
        file=sys.stderr,
    )
    print(f"Reason: {reason}", file=sys.stderr)
    print(
        "Use this file as a design template in a fork after validating SDK "
        "response shapes against your tenant. Re-run with --allow-scaffold only "
        "if you are actively finishing that private implementation.",
        file=sys.stderr,
    )
    raise SystemExit(2)
