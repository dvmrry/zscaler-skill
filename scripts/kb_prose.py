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
# A reference to another doc or graph node, outside link syntax: a repo .md path or a kb: ID.
_REF = re.compile(r"`?(?:kb:[\w.:/#-]+|(?:\.\./|\./)*[\w./-]+\.md(?:#[\w-]+)?|(?:\.\./|\./)*[\w./-]*zscaler-help/[\w.-]+\.json)`?")


def is_kb_prose(path: Path | str) -> bool:
    p = Path(path)
    return p.suffix == ".md" and p.with_suffix(".json").exists()


def links_blanked(text: str) -> str:
    """Text with every link and doc reference blanked; equal before/after means a reference-only edit.

    Markdown links (label and target), bare `.md` paths, help-capture `.json` paths and `kb:` IDs all
    count as references, so retargeting a mention of a converted doc to its graph ID, or of a help
    capture to its JSON form, does not demand re-verifying sources.
    """
    return _REF.sub("<ref>", _LINK.sub("[]()", text))
