#!/bin/bash
set -e

# Get the current version from manifest.json
CURRENT_VERSION=$(jq -r '.version' manifest.json)
echo "Current version: $CURRENT_VERSION"

# Parse the version components
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

# Increment the minor version and reset patch to 0
NEW_MINOR=$((MINOR + 1))
NEW_VERSION="$MAJOR.$NEW_MINOR.0"
echo "New version: $NEW_VERSION"

# Update the manifest.json file with the new version
jq --arg version "$NEW_VERSION" '.version = $version' manifest.json > manifest.json.tmp
mv manifest.json.tmp manifest.json
echo "Updated manifest.json to version $NEW_VERSION"

# Commit the change to manifest.json
git add manifest.json
git commit -m "chore: bump version to $NEW_VERSION"
echo "Committed version change"

# Create a git tag for the new version
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"
echo "Created git tag v$NEW_VERSION"

# Push the commit and tag to the remote repository
git push origin HEAD
git push origin "v$NEW_VERSION"
echo "🎉 Successfully released version $NEW_VERSION!"
