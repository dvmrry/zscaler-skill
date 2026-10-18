"""kb_prose.py — transition helper shared by the legacy Markdown checkers.

A ``.md`` file with a sibling ``.json`` of the same stem is knowledge-graph
prose (see ``scripts/kb-lib.mjs`` ``isKbProse``). It has no frontmatter and no
inline citations by design; ``node scripts/kb.mjs validate`` checks it. The
legacy checkers skip it, and these exclusions go away with those checkers.
"""

from __future__ import annotations

import re
from pathlib import Path

_LINK = re.compile(r"\[[^\]]*\]\([^)\s]*\)")


def is_kb_prose(path: Path | str) -> bool:
    p = Path(path)
    return p.suffix == ".md" and p.with_suffix(".json").exists()


def links_blanked(text: str) -> str:
    """Text with every Markdown link (label and target) blanked; equal before/after means a link-only edit."""
    return _LINK.sub("[]()", text)
