Perfect. Let me draft **PRD.md** for create-effect-agent.

I'll base it on our conversation and keep it focused, clear, and actionable for the coding agent.

---

# PRD.md — create-effect-agent

## Overview

**create-effect-agent** is a CLI tool that bootstraps Effect-TS projects optimized for agentic coding. It extends the Effect CLI with an interactive TUI (Terminal User Interface) to guide developers through project setup, pre-configuring rules, ecosystem libraries, and agent configurations.

## Problem Statement

Setting up a new Effect project with agentic coding best practices requires:
- Installing and configuring multiple ecosystem libraries
- Setting up IDE rules (Cursor, VS Code, Windsurf)
- Configuring agent instruction files (Claude.md, Gemini.md, Agents.md)
- Integrating Effect patterns and linting rules
- Bootstrapping repository structure for team collaboration

This is error-prone, time-consuming, and inconsistent across projects.

## Solution

**create-effect-agent** automates this setup through:
1. Interactive TUI (OpenTui) for guided configuration
2. Effect CLI wrapper for seamless integration
3. Pre-configured templates with rules, libraries, and agent configs
4. Monorepo structure for reusability and ecosystem growth

## Goals

- **Primary**: Enable developers to bootstrap agentic Effect projects in minutes, not hours
- **Secondary**: Validate Effect CLI + OpenTui integration as a reusable pattern
- **Tertiary**: Establish a foundation for phase-based expansion (effect-supermemory, code-skill)

## Success Criteria

- [ ] CLI successfully creates a project with all required configurations
- [ ] Interactive TUI provides clear guidance at each step
- [ ] Generated project includes:
  - Effect Patterns rules (formatted for Cursor, VS Code, Windsurf)
  - Agent instruction files (Claude.md, Gemini.md, Agents.md)
  - Ecosystem libraries (effect-end, effect-mdx, effect-regex, etc.)
  - Proper tsconfig, package.json, and Effect setup
- [ ] effect-cli-tui integration is stable and documented
- [ ] Monorepo structure supports future library extraction

## User Stories

### Story 1: Developer Creates First Agentic Effect Project
**As a** developer new to Effect + agentic coding  
**I want to** run a single command and answer guided questions  
**So that** I get a fully configured project without manual setup

**Acceptance Criteria:**
- Running `pnpm create effect-agent my-app` starts an interactive TUI
- User can select project type, agent preferences, and libraries
- Generated project has all configs ready to use
- Project runs successfully out-of-the-box

### Story 2: Team Standardizes on Effect Agent Setup
**As a** team lead  
**I want** all team projects to follow the same agentic coding patterns  
**So that** we maintain consistency and best practices

**Acceptance Criteria:**
- Generated projects include standardized rules and configs
- IDE rules work across Cursor, VS Code, Windsurf
- Agent configs work across Claude, Gemini, and other supported agents

### Story 3: Library Developer Extracts effect-cli-tui
**As a** library maintainer  
**I want** to extract the Effect CLI + OpenTui integration  
**So that** other projects can reuse this pattern

**Acceptance Criteria:**
- effect-cli-tui is documented and independently usable
- Monorepo structure enables clean extraction
- Effect CLI + OpenTui integration is validated and stable

## Scope

### In Scope
- Effect CLI wrapper for interactive project creation
- OpenTui-based interactive configuration
- Pre-configured templates with rules and configs
- IDE rule files (Cursor, VS Code, Windsurf formats)
- Agent instruction files (Claude.md, Gemini.md, Agents.md)
- Ecosystem library integration (effect-end, effect-mdx, effect-regex)
- Monorepo structure (packages/effect-cli-tui, packages/create-effect-agent)
- Documentation (PRD, Architecture, ImplementationPlan, TestingPlan)

### Out of Scope
- Effect CLI modifications (we wrap, not fork)
- Web-based UI (CLI + TUI only)
- Deployment/hosting automation
- Integration with code-skill library (Phase 3)
- Integration with Effect Patterns website (Phase N)

## Tech Stack

- **Effect-TS**: 3.18
- **TypeScript**: 5.9
- **OpenTui**: Latest (for interactive TUI)
- **Effect CLI**: As dependency (wrapping, not forking)
- **Package Manager**: pnpm
- **Build Tool**: Turborepo (for monorepo tasks)

## Phases

### Phase 1a: Manual Bootstrap + effect-cli-tui Integration
- Manually set up create-effect-agent repo following Effect best practices
- Build effect-cli-tui package (Effect CLI wrapper + OpenTui integration)
- Validate integration works end-to-end
- Document manual setup steps

**Deliverables:**
- Hands-on documentation of manual setup
- Working effect-cli-tui package
- Test validating Effect CLI + OpenTui integration

### Phase 1b: create-effect-agent CLI
- Build create-effect-agent CLI on top of effect-cli-tui
- Implement interactive templates and rule generation
- Test full workflow (CLI → TUI → project generation)

**Deliverables:**
- Working create-effect-agent CLI
- Generated projects with all configs
- End-to-end tests

## Out-of-Band Decisions

None yet. Will update as we encounter unknowns.

---

**Does this capture the vision? Any edits before we move to Architecture.md?**