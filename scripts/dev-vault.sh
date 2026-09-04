#!/usr/bin/env bash
# Manages the dev vault "slots" that let several clones of this repo be tested in
# Obsidian at the same time.
#
# Obsidian resolves obsidian:// URIs by vault name and cannot register a new vault
# on its own. A vault checked into the repo therefore collides across clones: every
# copy is named the same, and Obsidian silently opens whichever one it saw first.
# Slots invert that. A fixed set of vaults lives outside the repos, registered once.
# Each clone claims one and symlinks its notes in, so the vault path is stable and
# the vault name is unique.
set -euo pipefail

SLOT_ROOT="${DND_SLOT_ROOT:-$HOME/obsidian-dev}"
SLOT_COUNT="${DND_SLOT_COUNT:-3}"
SLOT_PREFIX="dnd-slot"
PLUGIN_ID="dnd-ui-toolkit"
HOT_RELOAD_REPO="https://github.com/pjeby/hot-reload.git"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NOTES_DIR="$REPO_ROOT/dev/notes"
SEED_DIR="$REPO_ROOT/dev/vault-seed"

case "$(uname -s)" in
  Darwin) OBSIDIAN_JSON="$HOME/Library/Application Support/obsidian/obsidian.json" ;;
  *)      OBSIDIAN_JSON="${XDG_CONFIG_HOME:-$HOME/.config}/obsidian/obsidian.json" ;;
esac

die() { echo "error: $*" >&2; exit 1; }

slot_path() { echo "$SLOT_ROOT/$SLOT_PREFIX-$1"; }

# The clone that owns a slot, or empty when the slot is free. A claim whose repo no
# longer exists is treated as free, so deleted clones release their slot on their own.
slot_owner() {
  local claim="$1/.claim"
  [ -f "$claim" ] || return 0
  local owner
  owner="$(cat "$claim")"
  [ -d "$owner" ] || return 0
  echo "$owner"
}

# Reuses this clone's existing slot, otherwise takes the lowest-numbered free one.
claim_slot() {
  local i path owner
  for i in $(seq 1 "$SLOT_COUNT"); do
    path="$(slot_path "$i")"
    [ "$(slot_owner "$path")" = "$REPO_ROOT" ] && { echo "$path"; return 0; }
  done
  for i in $(seq 1 "$SLOT_COUNT"); do
    path="$(slot_path "$i")"
    owner="$(slot_owner "$path")"
    if [ -z "$owner" ]; then
      mkdir -p "$path"
      echo "$REPO_ROOT" > "$path/.claim"
      echo "$path"
      return 0
    fi
  done
  die "all $SLOT_COUNT slots are claimed. Run 'task dev:status' to see by whom,
       'task dev:release' in a clone you are done with, or raise DND_SLOT_COUNT."
}

# Mirrors dev/notes into the vault root as symlinks, so notes edited in Obsidian are
# edited in the clone's working tree and show up in git.
link_notes() {
  local slot="$1" entry name
  shopt -s nullglob
  for entry in "$slot"/*; do
    [ -L "$entry" ] || continue
    name="$(basename "$entry")"
    [ -e "$NOTES_DIR/$name" ] || rm "$entry"
  done
  for entry in "$NOTES_DIR"/*; do
    name="$(basename "$entry")"
    ln -sfn "$entry" "$slot/$name"
  done
  shopt -u nullglob
}

setup_slot() {
  local slot plugin_dir
  slot="$(claim_slot)"
  plugin_dir="$slot/.obsidian/plugins/$PLUGIN_ID"

  mkdir -p "$plugin_dir"
  # -n so this seeds a new slot but never overwrites config Obsidian has since rewritten
  cp -Rn "$SEED_DIR/.obsidian/." "$slot/.obsidian/" 2>/dev/null || true
  touch "$plugin_dir/.hotreload"

  if [ ! -d "$slot/.obsidian/plugins/hot-reload" ]; then
    echo "installing hot-reload plugin..."
    git clone --quiet "$HOT_RELOAD_REPO" "$slot/.obsidian/plugins/hot-reload"
  fi

  link_notes "$slot"
  echo "$slot"
}

# Obsidian keys its vault list by a generated ID; the name in the UI is the folder
# name. Opening by ID is the only unambiguous form when several clones are in play.
vault_id() {
  python3 - "$OBSIDIAN_JSON" "$1" <<'PY'
import json, os, sys
config, target = sys.argv[1], os.path.realpath(sys.argv[2])
try:
    vaults = json.load(open(config)).get("vaults", {})
except (OSError, ValueError):
    sys.exit(1)
for vid, v in vaults.items():
    if os.path.realpath(v.get("path", "")) == target:
        print(vid)
        sys.exit(0)
sys.exit(1)
PY
}

cmd_plugin_dir() { echo "$(claim_slot)/.obsidian/plugins/$PLUGIN_ID"; }
cmd_setup()      { setup_slot >/dev/null; echo "slot ready: $(claim_slot)"; }

cmd_open() {
  local slot vid
  slot="$(setup_slot)"
  if ! vid="$(vault_id "$slot")"; then
    die "slot is not registered with Obsidian yet. Run 'task dev:register' once
       (with Obsidian closed), or add it by hand with 'Open folder as vault':

         $slot"
  fi
  echo "opening $(basename "$slot") -> $REPO_ROOT"
  open "obsidian://open?vault=$vid" 2>/dev/null || xdg-open "obsidian://open?vault=$vid"
}

cmd_register() {
  pgrep -x Obsidian >/dev/null && die "close Obsidian first. It rewrites obsidian.json on quit and would discard these entries."
  [ -f "$OBSIDIAN_JSON" ] || die "no Obsidian config at $OBSIDIAN_JSON. Launch Obsidian once, then retry."

  local i
  for i in $(seq 1 "$SLOT_COUNT"); do mkdir -p "$(slot_path "$i")"; done

  cp "$OBSIDIAN_JSON" "$OBSIDIAN_JSON.bak"
  python3 - "$OBSIDIAN_JSON" "$SLOT_ROOT" "$SLOT_PREFIX" "$SLOT_COUNT" <<'PY'
import json, os, secrets, sys, time
config, root, prefix, count = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
data = json.load(open(config))
vaults = data.setdefault("vaults", {})
known = {os.path.realpath(v.get("path", "")) for v in vaults.values()}
added = []
for i in range(1, count + 1):
    path = os.path.join(root, f"{prefix}-{i}")
    if os.path.realpath(path) in known:
        continue
    vaults[secrets.token_hex(8)] = {"path": path, "ts": int(time.time() * 1000), "open": False}
    added.append(path)
json.dump(data, open(config, "w"), indent=2)
print("\n".join(f"  registered {p}" for p in added) or "  all slots already registered")
PY
  echo "backup written to $OBSIDIAN_JSON.bak"
}

cmd_status() {
  local i path owner vid
  echo "slot root: $SLOT_ROOT"
  for i in $(seq 1 "$SLOT_COUNT"); do
    path="$(slot_path "$i")"
    owner="$(slot_owner "$path")"
    vid="$(vault_id "$path" 2>/dev/null || echo "NOT REGISTERED")"
    printf '  %-12s %-14s %s\n' "$(basename "$path")" "$vid" "${owner:-(free)}"
  done
}

cmd_release() {
  local i path
  for i in $(seq 1 "$SLOT_COUNT"); do
    path="$(slot_path "$i")"
    if [ "$(slot_owner "$path")" = "$REPO_ROOT" ]; then
      rm -f "$path/.claim"
      echo "released $(basename "$path")"
      return 0
    fi
  done
  echo "this clone holds no slot"
}

case "${1:-}" in
  plugin-dir) cmd_plugin_dir ;;
  setup)      cmd_setup ;;
  open)       cmd_open ;;
  register)   cmd_register ;;
  status)     cmd_status ;;
  release)    cmd_release ;;
  *) die "usage: dev-vault.sh {plugin-dir|setup|open|register|status|release}" ;;
esac
