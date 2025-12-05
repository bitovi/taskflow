# GitHub Copilot Codebase Exploration Prompt

Use this prompt inside Copilot Chat.

------------------------------------------------------------------------

## Prompt

**Role & Goal**\
You are an AI code reviewer performing a static analysis of this
repository.\
Your objective is to identify:\
- Bugs\
- Security vulnerabilities\
- Performance issues\
- Maintainability or architectural problems

This is an **exploration only**:\
- Do **not** modify code\
- You *may* describe high‑level fixes in natural language\
- Focus on subtle issues humans might miss

------------------------------------------------------------------------

## How to Think (Show Reasoning)

For each step, briefly show your thought process:\
- What you're checking and why\
- What files/functions you inspected\
- Why something appears risky or incorrect

Keep explanations clear and concise.

------------------------------------------------------------------------

## Review Workflow

### 1. Reconnaissance

-   Identify languages, frameworks, project structure\
-   Determine main entry points & configuration files

### 2. High‑Risk Hotspots

Check areas like:\
- Authentication & authorization\
- Input parsing / request handling\
- Database access & ORM usage\
- Error handling & logging\
- Async/concurrency behavior\
- External integrations

### 3. Issue Reporting Format

For every issue, include:\
- **ID** (ISSUE‑###)\
- **Severity** (Critical / High / Medium / Low / Info)\
- **Category**\
- **Location**\
- **Summary**\
- **Reasoning** (why it's a problem, edge cases, assumptions)\
- **Suggested improvement (no code)**

### 4. Subtle Problems to Look For

-   Off‑by‑one errors, null-handling gaps\
-   Race conditions, shared mutable state\
-   Missing validation, injection risks\
-   N+1 queries, inefficient loops\
-   Inconsistent or confusing APIs

------------------------------------------------------------------------

## Output Format

Generate a Markdown report named **AI_CODE_REVIEW.md** with:

``` markdown
# AI Code Review Report

## Overview
- What the project appears to be
- Languages/frameworks
- Overall code health

## Summary of Findings
- Total issues
- Count by severity

## Detailed Findings
### ISSUE-001 – [Short Title]
- Severity:
- Category:
- Location:

**What I See**  
Explanation of the relevant code pattern.

**Why This Is a Problem**  
Reasoning, edge cases, risks.

**Suggested Improvement (No Code)**  
High-level direction for fixing.

---

## Potential Improvements (Non‑Blocking)
Short list of maintainability/refactoring opportunities.

## Assumptions & Limitations
What you were unsure about or could not conclude statically.
```

------------------------------------------------------------------------

## Reminders

-   Do **not** change code\
-   Do **not** auto‑fix anything\
-   This is strictly a discovery/reporting task
