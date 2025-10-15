# SDK Publishing Guide

Complete guide for publishing `@migratefun/sdk` to npm registry.

## Prerequisites

Before publishing, ensure you have:

- [x] npm account with publish access to `@migratefun` org
- [x] Two-factor authentication (2FA) enabled
- [x] npm CLI installed and authenticated (`npm login`)
- [x] Write access to the GitHub repository
- [x] Clean working directory (all changes committed)

## Publishing Checklist

### 1. Pre-Publish Validation

Run these commands in the `sdk/` directory:

```bash
# 1. Ensure clean working directory
git status
# Should show: "nothing to commit, working tree clean"

# 2. Pull latest changes
git checkout main
git pull origin main

# 3. Install dependencies
yarn install

# 4. Run type checking
yarn typecheck
# Must pass with 0 errors

# 5. Run tests
yarn test
# All tests must pass

# 6. Build the package
yarn build
# Verify dist/ folder is created with all artifacts

# 7. Check package contents
npm pack --dry-run
# Review the file list to ensure no sensitive files included
```

**Expected Build Output:**
```
dist/
├── index.js           (ESM bundle)
├── index.cjs          (CommonJS bundle)
├── index.d.ts         (TypeScript declarations)
├── react/
│   ├── index.js
│   ├── index.cjs
│   └── index.d.ts
└── *.map              (Source maps)
```

---

### 2. Version Bumping

Follow [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH):

- **PATCH** (0.1.0 → 0.1.1): Bug fixes, no API changes
- **MINOR** (0.1.0 → 0.2.0): New features, backward compatible
- **MAJOR** (0.1.0 → 1.0.0): Breaking API changes

**Current Version**: `0.1.0-next.0` (pre-release)

#### Bump Commands:

```bash
# For patch release (bug fixes)
npm version patch
# 0.1.0-next.0 → 0.1.0-next.1

# For minor release (new features)
npm version minor
# 0.1.0-next.0 → 0.2.0-next.0

# For major release (breaking changes)
npm version major
# 0.1.0-next.0 → 1.0.0-next.0

# For first stable release (remove -next tag)
npm version 0.1.0
# 0.1.0-next.0 → 0.1.0
```

**What `npm version` does:**
1. Updates `package.json` version
2. Creates a git commit with message "v<version>"
3. Creates a git tag "v<version>"

---

### 3. Update Changelog

Edit `CHANGELOG.md` with changes in this release:

```markdown
## [0.1.1] - 2025-10-15

### Added
- New `formatTokenAmount` returns string for full precision
- Enhanced `calculateMftAmount` with banker's rounding

### Fixed
- Fixed Anchor 0.31.0 account handling (removed manual PDAs)
- Fixed React cleanup hook memory leak in `useMigrate`
- Fixed decimal precision loss in token amount formatting

### Changed
- `FormattedBalances` interface now returns string instead of number

### Breaking Changes
- **BREAKING**: `formatTokenAmount` now returns `string` instead of `number`
  - Migration: Use `parseFloat(formatted.oldToken)` if you need numeric operations
```

Commit the changelog:
```bash
git add CHANGELOG.md
git commit -m "docs: update changelog for v0.1.1"
```

---

### 4. Push Tags to GitHub

```bash
# Push the version commit and tag
git push origin main --tags
```

This triggers:
- GitHub release creation (if automated)
- CI/CD pipeline (if configured)

---

### 5. Publish to npm

#### Option A: Publish to `next` tag (Pre-release/Beta)

For testing and early access:

```bash
npm publish --tag next --access public
```

Installation:
```bash
yarn add @migratefun/sdk@next
```

#### Option B: Publish to `latest` tag (Stable Release)

For production use:

```bash
npm publish --access public
```

Installation:
```bash
yarn add @migratefun/sdk
# Installs the latest stable version
```

**Important Notes:**
- `--access public` is required for scoped packages (@migratefun)
- First-time publish requires org permissions
- Publishing is **irreversible** - you cannot unpublish after 72 hours

---

### 6. Post-Publish Verification

#### 6.1 Verify on npm Registry

```bash
# Check package info
npm view @migratefun/sdk

# Check specific version
npm view @migratefun/sdk@0.1.1

# Check all versions
npm view @migratefun/sdk versions
```

Expected output should show:
- Correct version number
- All dist-tags (latest, next)
- Correct repository URL
- Correct license

#### 6.2 Test Installation in Clean Environment

```bash
# Create test directory
mkdir /tmp/sdk-test && cd /tmp/sdk-test
npm init -y

# Install published package
npm install @migratefun/sdk @coral-xyz/anchor @solana/web3.js @solana/spl-token

# Test ESM import
node -e "import('@migratefun/sdk').then(sdk => console.log('✓ ESM import works', Object.keys(sdk)))"

# Test CJS require
node -e "const sdk = require('@migratefun/sdk'); console.log('✓ CJS require works', Object.keys(sdk))"

# Test React hooks (if React installed)
npm install react
node -e "import('@migratefun/sdk/react').then(sdk => console.log('✓ React hooks work', Object.keys(sdk)))"
```

#### 6.3 Test in Example App

```bash
cd /Users/jerrodjordan/Code/emblem-core/migrate.fun/sdk/examples/nextjs-demo

# Update to use published version
yarn add @migratefun/sdk@latest  # or @next

# Run dev server
yarn dev

# Test migration flow manually
```

#### 6.4 Update Documentation

Update main README if needed:

```bash
cd /Users/jerrodjordan/Code/emblem-core/migrate.fun
# Update any references to SDK version or installation
git add README.md
git commit -m "docs: update SDK installation instructions"
git push
```

---

## Rollback Procedure

If you need to rollback a problematic release:

### Option 1: Deprecate Version (Recommended)

```bash
npm deprecate @migratefun/sdk@0.1.1 "This version has critical bugs, please upgrade to 0.1.2"
```

This doesn't remove the package but warns users not to use it.

### Option 2: Publish Hotfix

1. Identify the issue
2. Fix the bug in a new branch
3. Increment PATCH version
4. Publish hotfix version
5. Deprecate problematic version

```bash
# Fix the bug
git checkout -b hotfix/v0.1.2
# ... make fixes ...
git commit -m "fix: resolve critical issue in v0.1.1"

# Version bump
npm version patch  # 0.1.1 → 0.1.2

# Publish hotfix
npm publish --access public

# Deprecate old version
npm deprecate @migratefun/sdk@0.1.1 "Critical bug fixed in 0.1.2"
```

### Option 3: Unpublish (Only within 72 hours)

**WARNING**: This should be a last resort and is only allowed within 72 hours of publishing.

```bash
npm unpublish @migratefun/sdk@0.1.1
```

---

## Distribution Tags

npm uses tags to manage different release channels:

### Available Tags

| Tag | Purpose | Usage |
|-----|---------|-------|
| `latest` | Stable production releases | `yarn add @migratefun/sdk` |
| `next` | Pre-release/beta versions | `yarn add @migratefun/sdk@next` |
| `beta` | Early beta testing | `yarn add @migratefun/sdk@beta` |
| `canary` | Nightly/experimental builds | `yarn add @migratefun/sdk@canary` |

### Managing Tags

```bash
# Publish to specific tag
npm publish --tag next

# Move a tag to different version
npm dist-tag add @migratefun/sdk@0.1.1 latest

# Remove a tag
npm dist-tag rm @migratefun/sdk next

# List all tags
npm dist-tag ls @migratefun/sdk
```

---

## CI/CD Automation

### Automated Publishing with GitHub Actions

See `.github/workflows/publish-sdk.yml` for automated publishing on:
- Push to `main` branch (auto-publish to `next`)
- GitHub release creation (publish to `latest`)
- Manual workflow dispatch

**Manual Trigger:**
1. Go to GitHub Actions tab
2. Select "Publish SDK" workflow
3. Click "Run workflow"
4. Choose version type (patch/minor/major)
5. Confirm and run

---

## Security Best Practices

### 1. npm Token Management

**Never commit npm tokens to git!**

```bash
# Set up npm token locally
npm login

# For CI/CD, use secrets
# GitHub: Settings → Secrets → NPM_TOKEN
```

### 2. Two-Factor Authentication

Enable 2FA for npm account:
```bash
npm profile enable-2fa auth-and-writes
```

This requires OTP for publishing:
```bash
npm publish --otp=123456
```

### 3. Package Provenance

Enable provenance for supply chain security:
```bash
npm publish --provenance --access public
```

This creates a cryptographic link between the package and its source code.

---

## Troubleshooting

### Issue: "You must sign up for private packages"

**Solution**: Add `--access public` flag
```bash
npm publish --access public
```

### Issue: "Version already exists"

**Solution**: Bump the version and try again
```bash
npm version patch
npm publish
```

### Issue: "Missing README"

**Solution**: Ensure `README.md` exists in sdk/ directory

### Issue: "Cannot publish over previously published version"

**Solution**: You can't republish the same version. Bump version:
```bash
npm version patch
npm publish
```

### Issue: "401 Unauthorized"

**Solution**: Re-authenticate with npm
```bash
npm logout
npm login
```

### Issue: "403 Forbidden"

**Solution**: Check if you have publish access to @migratefun org
```bash
npm access list packages @migratefun
```

Contact org owner to grant publish access.

---

## Version Strategy

### Pre-1.0 (Current)

- Use `0.x.y` versioning
- Use `next` tag for all releases
- Breaking changes allowed in MINOR versions
- Reserve `latest` tag for stable 1.0.0 release

### Post-1.0 (Stable)

- Follow strict semantic versioning
- Breaking changes only in MAJOR versions
- MINOR for new features (backward compatible)
- PATCH for bug fixes only
- Use `latest` tag for stable releases

### Release Cadence

- **Patch releases**: As needed for bug fixes
- **Minor releases**: Monthly or when new features are ready
- **Major releases**: Every 6-12 months, or when breaking changes are necessary

---

## Release Checklist Template

Copy this checklist for each release:

```markdown
## Release v0.1.x Checklist

### Pre-Release
- [ ] All tests passing
- [ ] Build successful
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Git tag created
- [ ] Changes pushed to GitHub

### Publishing
- [ ] Published to npm (tag: ___)
- [ ] Verified on npm registry
- [ ] Tested installation in clean environment
- [ ] Example app works with new version

### Post-Release
- [ ] GitHub release created
- [ ] Documentation updated
- [ ] Partners notified (if breaking changes)
- [ ] Migration guide written (if breaking changes)

### Issues?
- [ ] None / Fixed / Rollback performed
```

---

## Support

**Questions about publishing?**
- Contact: [your-team-email]
- Slack: #sdk-releases
- GitHub Discussions: [link]

**npm Registry Issues:**
- npm support: https://www.npmjs.com/support

---

## Additional Resources

- [npm Publishing Documentation](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [Semantic Versioning Spec](https://semver.org/)
- [npm Scope Documentation](https://docs.npmjs.com/cli/v9/using-npm/scope)
- [Package Provenance](https://docs.npmjs.com/generating-provenance-statements)

---

**Last Updated**: 2025-10-15
**SDK Version**: 0.1.0-next.0
**Maintainers**: [@migrate.fun-team]
