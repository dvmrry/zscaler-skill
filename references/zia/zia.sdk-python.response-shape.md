The Python SDK reports API errors in its return value by default, though some calls raise regardless. How its pages are walked is in [[zia.sdk-python.pagination]], and its retry and rate-limit behavior is in [[zia.api.rate-limits]].

**Return shape.** {{tuple-return}} {{single-assignment-yields-tuple}} {{result-models-snake-case-attrs}}

**Errors are values.** {{errors-in-third-slot}} {{validation-errors-returned}} {{callers-must-check-error}} Whether a later SDK release will raise instead is open {{gap:raise-proposal}}.

**Filtering.** {{search-current-page}}
