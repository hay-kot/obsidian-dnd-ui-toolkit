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
    
else
    echo "🧪 Creating pre-release (not on main branch)..."
    
    # Create pre-release version with branch name
    NEW_MINOR=$((MINOR + 1))
    BRANCH_NAME=$(echo "$CURRENT_BRANCH" | sed 's/[^a-zA-Z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    NEW_VERSION="$MAJOR.$NEW_MINOR.0-${BRANCH_NAME}.1"
    
    # Create temporary manifest without committing
    echo "Creating temporary manifest for pre-release..."
    cp manifest.json manifest.json.backup
    jq --arg version "$NEW_VERSION" '.version = $version' manifest.json > manifest.json.tmp
    mv manifest.json.tmp manifest.json

    # Create a git tag for the new version
    git tag -a "v$NEW_VERSION" -m "Pre-release v$NEW_VERSION from $CURRENT_BRANCH"
    echo "Created git tag v$NEW_VERSION"

    # Push the tag only
    git push origin "v$NEW_VERSION"

    # Restore original manifest
    mv manifest.json.backup manifest.json
    echo "Restored original manifest.json"
fi

echo "🎉 Successfully released version $NEW_VERSION!"
