# AI Code Review - Find Bugs

You are performing static analysis to identify bugs, security vulnerabilities, performance issues, and architectural problems in this codebase.

**Important**: This is exploration only. Do not modify code - just report findings.

## Steps

1. **Understand the codebase** - Identify languages, frameworks, structure, and entry points.

2. **Check high-risk areas**:

   - Authentication & authorization
   - Input validation & request handling
   - Database queries & ORM usage
   - Error handling
   - Async/concurrency patterns
   - External integrations

3. **Look for subtle issues**:
   - Null handling gaps
   - Race conditions & shared state
   - Missing validation & injection risks
   - N+1 queries & inefficient loops
   - Off-by-one errors

## Report Format

Create **AI_CODE_REVIEW.md** with:

### Overview

- Project description
- Tech stack
- Overall code health

### Summary

- Total issues found
- Count by severity (Critical / High / Medium / Low / Info)

### Detailed Findings

For each issue:

**ISSUE-001 - [Short Title]**

- **Severity**: Critical/High/Medium/Low/Info
- **Category**: Security/Performance/Bug/Maintainability
- **Location**: `file.ts:123`
- **Problem**: What's wrong and why it matters
- **Fix**: High-level suggestion (no code)
