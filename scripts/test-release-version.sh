#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
script="$repo_root/scripts/release-version.sh"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

repo="$(mktemp -d "$tmp_dir/repo.XXXXXX")"
cd "$repo"
git init -q
git config user.email "test@example.invalid"
git config user.name "zscaler-skill test"
git commit --allow-empty -m initial >/dev/null
git tag v0.68.1

# start_change checks out base; the change under test is base..HEAD.
start_change() {
	git checkout -q --detach base
}

commit_notes() {
	local path="$1"
	local body="$2"
	mkdir -p "$(dirname "$path")"
	printf '%s' "$body" >"$path"
	git add "$path"
	git commit -q -m "change"
}

assert_version() {
	local want="$1"
	local got
	got="$("$script" base HEAD)"
	if [[ "$got" != "$want" ]]; then
		echo "release-version.sh = $got, want $want" >&2
		exit 1
	fi
}

assert_rejects() {
	local want="$1"
	if "$script" base HEAD >"$tmp_dir/out" 2>"$tmp_dir/err"; then
		echo "release-version.sh accepted a change it must reject ($want); printed $(cat "$tmp_dir/out")" >&2
		exit 1
	fi
	if ! grep -qF "$want" "$tmp_dir/err"; then
		echo "release-version.sh failed without \"$want\":" >&2
		cat "$tmp_dir/err" >&2
		exit 1
	fi
}

git tag base

# A change with no notes file releases nothing.
start_change
printf 'code\n' >code.txt
git add code.txt
git commit -q -m code
assert_version none

# Each next version is accepted, including 1.0.0 from the 0.x line.
for version in v0.68.2 v0.69.0 v1.0.0; do
	start_change
	commit_notes "docs/releases/$version.md" "Notes for $version."
	assert_version "$version"
done

start_change
commit_notes docs/releases/v0.70.0.md "Skips a minor."
assert_rejects "does not follow v0.68.1"

start_change
commit_notes docs/releases/v0.68.1.md "Reuses a version."
assert_rejects "tag v0.68.1 already exists"

start_change
commit_notes docs/releases/v1.0.md "Not three parts."
assert_rejects "must be named docs/releases/vMAJOR.MINOR.PATCH.md"

start_change
commit_notes docs/releases/v01.0.0.md "Leading zero."
assert_rejects "must be named docs/releases/vMAJOR.MINOR.PATCH.md"

start_change
commit_notes docs/releases/v1.0.0.md $'  \n\t\n'
assert_rejects "is empty"

start_change
mkdir -p docs/releases
printf 'One.\n' >docs/releases/v0.68.2.md
printf 'Two.\n' >docs/releases/v0.69.0.md
git add docs/releases
git commit -q -m two
assert_rejects "adds 2 notes files"

# Released notes are never edited: from a base that already holds v1.0.0's
# notes and tag, editing them fails.
start_change
commit_notes docs/releases/v1.0.0.md "Released."
git tag v1.0.0
git tag -f base >/dev/null
printf 'Rewritten.\n' >docs/releases/v1.0.0.md
git commit -q -am edit
assert_rejects "docs/releases/v1.0.0.md is M"

# Deleting released notes publishes nothing, so a change may drop old notes
# alone or while it adds the next version's, as the 1.0 tree drops v0.x's.
git checkout -q --detach base
git rm -q docs/releases/v1.0.0.md
git commit -q -m delete
assert_version none
commit_notes docs/releases/v1.0.1.md "Patch."
assert_version v1.0.1

# After 1.0.0 the next versions follow it.
git checkout -q --detach base
commit_notes docs/releases/v1.0.1.md "Patch."
assert_version v1.0.1

if "$script" base >/dev/null 2>&1; then
	echo "release-version.sh accepted one argument" >&2
	exit 1
fi
if "$script" base no-such-ref >/dev/null 2>"$tmp_dir/err"; then
	echo "release-version.sh accepted an unknown commit" >&2
	exit 1
fi

echo "test-release-version: PASS"
