You are debugging a bug reported in `BUG_REPORT.md`. Follow these steps and explain your reasoning at each stage:

**Important**: Always use VS Code tasks via `run_task` tool. Never use `npm run` commands directly.

1. **Read the bug report** - Understand the issue, reproduction steps, and expected vs. actual behavior.

2. **Find the code** - Identify which files and functions are involved in the buggy behavior.

3. **Add logging** - Add console logs to trace data flow. Include the filename and function name in each log message.

4. **Run tests** - Use the `test:e2e:debug` task to run both the dev server and E2E tests together. This pipes all logs (including browser console) to the terminal for debugging multi-environment scenarios.

   - The task automatically handles port cleanup and runs both environments
   - Review all logs in the terminal output to trace the issue
   - keep watching the terminal until the tests complete.

5. **Write a test (optional)** - If no test covers this scenario, write one to reproduce the bug. Confirm it fails.

6. **Fix the bug** - Based on logs and investigation, implement the fix.

7. **Verify** - Re-run tests to confirm the fix works and nothing else broke.

8. **Clean up** - Remove debug logs to keep code clean.
