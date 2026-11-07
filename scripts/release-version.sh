#!/usr/bin/env bash
set -euo pipefail

# release-version.sh BASE HEAD prints the version a change releases, or
# "none". A change releases exactly when it adds one notes file
# docs/releases/vX.Y.Z.md: the file name is the version and its contents are
# the release notes. The version must be the next patch, minor or major after
# the highest existing vX.Y.Z tag. Released notes are never edited, so a
# change that modifies one fails; deleting old notes is allowed, since the
# published release keeps them. The PR check and the release workflow both
# call this, so a merge publishes exactly what review saw.

if (( $# != 2 )); then
	echo "usage: release-version.sh BASE HEAD" >&2
	exit 2
fi
base="$1"
head="$2"
notes_dir="docs/releases"

fail() {
	echo "release-version: $*" >&2
	exit 1
}

for ref in "$base" "$head"; do
	git rev-parse --verify -q "$ref^{commit}" >/dev/null || fail "unknown commit: $ref"
done

added=()
while IFS=$'\t' read -r status path; do
	[[ -n "$status" ]] || continue
	case "$status" in
		A) added+=("$path") ;;
		D) ;;
		*) fail "released notes are immutable; $path is ${status} in this change" ;;
	esac
done < <(git diff --no-renames --name-status "$base" "$head" -- "$notes_dir/")

if (( ${#added[@]} == 0 )); then
	echo none
	exit 0
fi
if (( ${#added[@]} > 1 )); then
	fail "a change releases one version; it adds ${#added[@]} notes files: ${added[*]}"
fi

path="${added[0]}"
if [[ ! "$path" =~ ^docs/releases/v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.md$ ]]; then
	fail "notes file must be named docs/releases/vMAJOR.MINOR.PATCH.md: $path"
fi
version="v${BASH_REMATCH[1]}.${BASH_REMATCH[2]}.${BASH_REMATCH[3]}"

if ! git show "$head:$path" | grep -q '[^[:space:]]'; then
	fail "$path is empty; its contents are the release notes"
fi
if git rev-parse --verify -q "refs/tags/$version" >/dev/null; then
	fail "tag $version already exists"
fi

latest="$(git tag -l 'v[0-9]*.[0-9]*.[0-9]*' --sort=-v:refname | sed -n '1p')"
major=0
minor=0
patch=0
if [[ -n "$latest" ]]; then
	[[ "$latest" =~ ^v([0-9]+)\.([0-9]+)\.([0-9]+)$ ]] || fail "latest semver tag has invalid format: $latest"
	major="${BASH_REMATCH[1]}"
	minor="${BASH_REMATCH[2]}"
	patch="${BASH_REMATCH[3]}"
fi
next_patch="v${major}.${minor}.$((patch + 1))"
next_minor="v${major}.$((minor + 1)).0"
next_major="v$((major + 1)).0.0"
case "$version" in
	"$next_patch" | "$next_minor" | "$next_major") ;;
	*) fail "$version does not follow ${latest:-no release}; the next version is $next_patch, $next_minor or $next_major" ;;
esac

echo "$version"
