#!/bin/bash
set -e

# Get current branch name
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $CURRENT_BRANCH"

# Get the current version from manifest.json
CURRENT_VERSION=$(jq -r '.version' manifest.json)
echo "Current version: $CURRENT_VERSION"

# Parse the version components
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

# Check if we're on main branch
if [[ "$CURRENT_BRANCH" == "main" ]]; then
    echo "📦 Creating regular release..."
    
    # Increment the minor version and reset patch to 0
    NEW_MINOR=$((MINOR + 1))
    NEW_VERSION="$MAJOR.$NEW_MINOR.0"
    RELEASE_TYPE="release"
    RELEASE_TITLE="v$NEW_VERSION"
    RELEASE_NOTES="Release v$NEW_VERSION"
    IS_PRERELEASE="false"
    
else
    echo "🧪 Creating pre-release (not on main branch)..."
    
    # Create pre-release version with branch name
    NEW_MINOR=$((MINOR + 1))
    BRANCH_NAME=$(echo "$CURRENT_BRANCH" | sed 's/[^a-zA-Z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    NEW_VERSION="$MAJOR.$NEW_MINOR.0-${BRANCH_NAME}.1"
    RELEASE_TYPE="pre-release"
    RELEASE_TITLE="v$NEW_VERSION - Pre-release from $CURRENT_BRANCH"
    RELEASE_NOTES="🧪 Pre-release build from branch: $CURRENT_BRANCH

⚠️ This is a pre-release version for testing purposes.
Please report any issues before merging to main.

Branch: \`$CURRENT_BRANCH\`
Base version: \`$CURRENT_VERSION\`"
    IS_PRERELEASE="true"
fi

echo "New version: $NEW_VERSION"

# Build the plugin to ensure we have latest artifacts
echo "Building plugin..."
npm run build

# For main branch: update manifest and commit
if [[ "$CURRENT_BRANCH" == "main" ]]; then
    # Update the manifest.json file with the new version
    jq --arg version "$NEW_VERSION" '.version = $version' manifest.json > manifest.json.tmp
    mv manifest.json.tmp manifest.json
    echo "Updated manifest.json to version $NEW_VERSION"

    # Commit the change to manifest.json
    git add manifest.json
    git commit -m "chore: bump version to $NEW_VERSION"
    echo "Committed version change"
else
    # For pre-release: create temporary manifest without committing
    echo "Creating temporary manifest for pre-release..."
    cp manifest.json manifest.json.backup
    jq --arg version "$NEW_VERSION" '.version = $version' manifest.json > manifest.json.tmp
    mv manifest.json.tmp manifest.json
fi

# Create a git tag for the new version
git tag -a "v$NEW_VERSION" -m "$RELEASE_TITLE"
echo "Created git tag v$NEW_VERSION"

# Push the tag (and commit if on main)
if [[ "$CURRENT_BRANCH" == "main" ]]; then
    git push origin HEAD
fi
git push origin "v$NEW_VERSION"

# Restore original manifest for pre-releases
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    mv manifest.json.backup manifest.json
    echo "Restored original manifest.json"
fi

echo "🎉 Successfully created $RELEASE_TYPE: $NEW_VERSION!"
echo "🚀 GitHub workflow will automatically create the release with artifacts."
echo "📋 Release will be marked as: $([[ "$IS_PRERELEASE" == "true" ]] && echo "pre-release" || echo "stable release")"
