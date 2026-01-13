# Fix Failing Tests

You are fixing failing tests. Run tests, identify failures, and fix them one at a time.

**Important**: Always use VS Code tasks via `run_task` tool. Never use `npm run` commands directly.

## Process

For each failing test:

1. **Identify** - Test file, test name, failed assertion, error message

2. **Explain** - Plain English: what went wrong and why

3. **Root cause** - Which file/function has the bug, what's broken, why it fails, how to fix

4. **Fix** - Make the code change

5. **Verify** - Re-run the test. If it passes, move to next failure. If not, repeat.

**Fix tests ONE AT A TIME.** Do not solve multiple failures in parallel.

---

Sample Output (do this for each failing test one at a time):

```
1) Fail/Where it failed

Test file: string-utils.test.ts
Failing assertion: expected sanitizeInput("Hi!!") to return "Hi!" but received "Hi!!".
Observed failure message: "Expected: Hi! Received: Hi!!"

2) High-level description (plain English)

The test expects sanitizeInput to collapse repeated punctuation so user input like "Hi!!" becomes "Hi!" for consistency. The implementation was returning the original string unchanged, so duplicate punctuation wasn’t being reduced.

3) Root cause & plan

Where the bug is: string-utils.ts, function sanitizeInput.
What went wrong: the code simply returned the input string without removing repeated punctuation characters.
Why that fails tests: tests assert that all consecutive identical punctuation marks should be collapsed to a single character.
Planned fix: update sanitizeInput to replace sequences of repeated punctuation with a single instance.

4) The fix I applied

File changed: string-utils.ts
Before: return input;
After: return input.replace(/([!?.])\1+/g, "$1");
(I applied that edit to string-utils.ts.)

5) Re-run test and result

Command run: npx jest string-utils.test.ts -i --silent
Result: PASS — all 4 tests in string-utils.test.ts passed.
Output: "PASS string-utils.test.ts — Tests: 4 passed"

Current status and next steps

Status: The sanitizeInput failure is fixed and verified.
While running the initial full suite earlier, there were additional failures I observed (I will handle them one at a time next):
task-runner.test.ts — TypeScript error where a function expects a Config object but receives undefined. Needs investigation.
form-renderer.test.tsx — test couldn’t find the primary action button; likely a markup or mocking change.
```
