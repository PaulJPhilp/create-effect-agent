# effect-cli-tui v0.5.0 Publication Checklist

## ✅ Completed: Automated Setup
- [x] Git repository initialized at `/Users/paul/Projects/In-Progress/effect-cli-tui`
- [x] Initial commit created: `9a53c15`
- [x] Remote configured: `https://github.com/PaulJPhilp/effect-cli-tui.git`
- [x] Monorepo decoupled: effect-cli-tui removed from packages/
- [x] create-effect-agent workspace updated
- [x] All tests passing: 14/14 ✅
- [x] All builds successful ✅
- [x] Refactor commit pushed to create-effect-agent

---

## 🔄 Next: Manual Steps Required

### Step 1: Create GitHub Repository
**Timing:** Immediate  
**How:**
1. Go to https://github.com/new
2. Enter:
   - Repository name: `effect-cli-tui`
   - Description: `Effect-native CLI wrapper with interactive prompts and Ink components for terminal UIs`
   - Visibility: **Public**
   - Initialize: Leave unchecked (we have files)
3. Click **Create repository**

**Expected Result:**
- Empty GitHub repository created
- URL: https://github.com/PaulJPhilp/effect-cli-tui

---

### Step 2: Push effect-cli-tui to GitHub
**Timing:** Immediately after Step 1  
**How:**
```bash
cd /Users/paul/Projects/In-Progress/effect-cli-tui
git push -u origin main
```

**Expected Result:**
```
To https://github.com/PaulJPhilp/effect-cli-tui.git
 * [new branch]      main -> main
Branch 'main' set up to track 'origin/main'.
```

**Verification:**
```bash
git log --oneline
# Should show: 9a53c15 Initial commit: effect-cli-tui v0.5.0
```

---

### Step 3: Create GitHub Release v0.5.0
**Timing:** After Step 2  
**How:**
1. Go to: https://github.com/PaulJPhilp/effect-cli-tui
2. Click **Releases** (right panel)
3. Click **Create a new release**
4. Fill form:
   - **Tag version:** `v0.5.0`
   - **Target:** `main`
   - **Release title:** `Initial Release: effect-cli-tui v0.5.0`
   - **Description:** Use template below
   - **Checkbox:** ☐ This is a pre-release (leave unchecked)
5. Click **Publish release**

**Release Description Template:**
```markdown
# effect-cli-tui v0.5.0 🎉

Initial standalone release of effect-cli-tui, extracted from create-effect-agent.

## Features ✨
- Effect-native prompts (text, select, multi-select, confirm)
- CLI command execution with capture and streaming
- React/Ink component rendering for terminal UIs
- Full TypeScript support with strict mode
- Comprehensive error handling with discriminated errors

## Core Exports 📦
- `EffectCLI` - Execute CLI commands with Effect
- `TUIHandler` - Interactive prompts and UI components
- `renderInkComponent` - Render React components in terminal

## Documentation 📚
- [README](./README.md) - User guide and examples
- [API](./docs/API.md) - Complete API reference
- [Architecture](./docs/ARCHITECTURE.md) - Technical design

## Requirements 🔧
- Node.js >= 20
- Dependencies:
  - effect ^3.18.0
  - ink ^4.0.0
  - react ^18.0.0
  - @inquirer/prompts ^5.0.0

## Installation 📥
```bash
npm install effect-cli-tui@0.5.0
```

## Usage 🚀
```typescript
import { EffectCLI, TUIHandler } from 'effect-cli-tui';

const cli = new EffectCLI();
const tui = new TUIHandler();
```

See [README.md](./README.md) for comprehensive examples.

## Changelog 📝
- Initial standalone release
- Extracted from create-effect-agent monorepo
- All tests passing (5/5) ✅
- Full TypeScript support
- Ready for production use

## Links 🔗
- Repository: https://github.com/PaulJPhilp/effect-cli-tui
- npm: https://www.npmjs.com/package/effect-cli-tui
- Author: Paul Philp
```

**Expected Result:**
- Release published at https://github.com/PaulJPhilp/effect-cli-tui/releases/tag/v0.5.0
- GitHub Actions workflow triggered automatically
- Build and publish workflows running

**Timing:** GitHub Actions may take 2-5 minutes

---

### Step 4: Monitor GitHub Actions
**Timing:** While waiting for npm publish  
**How:**
1. Go to: https://github.com/PaulJPhilp/effect-cli-tui/actions
2. Monitor workflow runs:
   - `test.yml` - Runs tests (should complete first)
   - `publish.yml` - Publishes to npm (runs after test succeeds)

**Expected:**
```
✅ test.yml - All tests pass (5/5)
✅ publish.yml - Package published to npm
```

**If workflows fail:**
- Check workflow logs at https://github.com/PaulJPhilp/effect-cli-tui/actions
- Ensure npm token is in GitHub Secrets
- Common issues:
  - Missing `NPM_TOKEN` in GitHub Secrets
  - Invalid token permissions
  - Build errors (unlikely, tested locally)

---

### Step 5: Verify npm Publication
**Timing:** After github actions complete (2-5 minutes from Step 3)  
**How:**

Check local:
```bash
npm view effect-cli-tui@0.5.0
npm search effect-cli-tui
```

Check online:
- Visit: https://www.npmjs.com/package/effect-cli-tui
- Should show version 0.5.0

**Expected Output:**
```
effect-cli-tui | 0.5.0 | MIT | deps: 4 | versions: 1

= effect-cli-tui@0.5.0 =

Effect-native CLI wrapper with interactive prompts and Ink components for terminal UIs

bin: n/a
dist
.tarball: https://registry.npmjs.org/effect-cli-tui/-/effect-cli-tui-0.5.0.tgz
.shasum: [hash]
...
```

**Verification Install:**
```bash
# In a temporary directory
npm install effect-cli-tui@0.5.0
# Should complete without errors
```

---

### Step 6: Update create-effect-agent
**Timing:** After Step 5 (npm package confirmed)  
**How:**

Update workspace configuration:
```bash
cd /Users/paul/Projects/In-Progress/create-effect-agent
```

**File 1:** pnpm-workspace.yaml
```yaml
# Change FROM:
packages:
  - 'packages/create-effect-agent'
  - '../effect-cli-tui'

# Change TO:
packages:
  - 'packages/create-effect-agent'
```

**File 2:** packages/create-effect-agent/package.json
```json
// Change FROM:
"dependencies": {
  "effect": "^3.18.0",
  "effect-cli-tui": "workspace:*"
}

// Change TO:
"dependencies": {
  "effect": "^3.18.0",
  "effect-cli-tui": "^0.5.0"
}
```

**Then:**
```bash
cd /Users/paul/Projects/In-Progress/create-effect-agent
pnpm install
pnpm build
pnpm exec vitest run
```

**Expected:**
```
✅ pnpm install succeeds
✅ All builds successful
✅ All tests pass (9/9)
✅ No errors or warnings (except peer dep warnings for react)
```

---

### Step 7: Commit Final Changes
**Timing:** After Step 6 verification  
**How:**
```bash
cd /Users/paul/Projects/In-Progress/create-effect-agent

git status  # Verify changes
git add -A
git commit -m "refactor: consume effect-cli-tui from npm registry

- Update pnpm-workspace.yaml to only include create-effect-agent
- Update package.json to use effect-cli-tui@0.5.0 from npm
- Verified all tests pass (9/9)
- All builds successful

effect-cli-tui is now an independent published package:
- GitHub: https://github.com/PaulJPhilp/effect-cli-tui
- npm: https://www.npmjs.com/package/effect-cli-tui
- Version: 0.5.0"

git push
```

**Expected:**
```
To https://github.com/PaulJPhilp/create-effect-agent.git
   771e44d..XXXXXXX  main -> main
```

---

## ✅ Final Verification

### effect-cli-tui
- [ ] GitHub repository created
- [ ] All commits pushed
- [ ] Release v0.5.0 published
- [ ] npm package visible
- [ ] Installable with `npm install effect-cli-tui@0.5.0`
- [ ] Tests passing in GitHub Actions

### create-effect-agent
- [ ] Workspace updated (only create-effect-agent)
- [ ] Dependency changed to ^0.5.0
- [ ] pnpm install succeeds
- [ ] Build succeeds
- [ ] All tests pass (9/9)
- [ ] Final commit pushed

### Integration
- [ ] Standalone npm install works
- [ ] No circular dependencies
- [ ] No workspace coupling
- [ ] Both projects independent

---

## Timeline Estimate

- **Step 1-3:** 5 minutes (manual web interface)
- **Step 4:** 2-5 minutes (GitHub Actions, automated)
- **Step 5:** 1 minute (verification)
- **Step 6-7:** 10 minutes (configuration + testing)

**Total:** ~25 minutes

---

## Troubleshooting

### npm package not visible after workflow
- Wait additional 5-10 minutes (npm registry cache)
- Verify workflow completed successfully
- Check npm token in GitHub Secrets

### Tests fail in GitHub Actions
- Run tests locally: `cd effect-cli-tui && pnpm exec vitest run`
- If local pass, check Actions for environment differences
- Common: missing node_modules or build artifacts

### create-effect-agent build fails after npm update
- Run `pnpm install` again
- Clear `node_modules/`: `rm -rf node_modules`
- Verify npm package version: `npm view effect-cli-tui@0.5.0`

### Git push denied
- Verify GitHub token has repo write access
- Check SSH keys if using SSH
- Try: `git push --force-with-lease`

---

## Success Indicators 🎉

When complete, you should have:
1. ✅ effect-cli-tui published and installable
2. ✅ Two independent projects on GitHub
3. ✅ create-effect-agent consuming published package
4. ✅ All tests passing (14/14 total)
5. ✅ No workspace coupling
6. ✅ Monorepo lean and focused

**Status after all steps:** `v0.5.0 Released & Decoupled` ✨
