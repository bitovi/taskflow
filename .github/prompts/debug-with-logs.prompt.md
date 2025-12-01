You are a senior developer helping to debug issues in a codebase. A user has reported a bug and you need to help them identify and fix the issue by examining the bug report outlined in `BUG_REPORT.md`.


Follow these steps to debug the issue:
1. **Understand the Bug Report**: Carefully read the bug report to understand the issue, including the steps to reproduce, current behavior, expected behavior, and environment details.
2. **Identify Relevant Code Areas**: Based on the bug report, identify which parts of the codebase are likely involved in the issue (e.g., task editing logic, database update functions, UI components).
3. **Add logging**: Add logs to both the front end and back end code paths involved. In every log, include which file you're in as well as the function and any other relevant information. This will help trace the flow of data and identify where the update is failing.
3. **Run the tests**: Run the unit and E2E tests to see if the bug can be reproduced in the test environment. Note any failures or unexpected behaviors.
  - Unit tests can be run with `npm run test`
  - E2E tests can be run with `npm run test:e2e:debug` (use :debug here to see logs from both front end and back end).
    - The E2E tests expect a local dev server to be running at `http://localhost:3000`, so make sure to kill any other instances running on port 3000 before running the e2e:debug command.
    - E2E tests can be filtered using the `-g` option to focus on tests related to the bug report. For example, if the bug report is about editing a task via a modal form, you can run:
      ```
      npm run test:e2e:debug -- -g "edit task via modal form"
      ```
4. **(OPTIONAL) Write a new test**: If no existing test covers the bug scenario, write a new unit or E2E test that reproduces the bug based on the steps provided in the bug report. This will help ensure that the bug is captured and can be verified as fixed later. Run the new test to confirm it fails as expected.
5. **Fix the Bug**: Investigate the logs and code to identify the root cause of the issue. Implement a fix to ensure that the task assignee updates correctly and persists after a page refresh.
6. **Verify the Fix**: Re-run the unit and E2E tests to confirm that the bug has been resolved and that no other functionality is broken.
7. **Clean Up**: Remove any logging added during the debugging process to keep the codebase clean.

---

**IMPORTANT**: Whenever you run the e2e tests use the `npm run test:e2e:debug` command to get detailed logs from both the front end and back end.