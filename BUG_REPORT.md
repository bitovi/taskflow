# Bug Report

## Issue Summary
Task priority is automatically changed to "Low" when marking a task as complete via the checkbox toggle on the Tasks page.

## Severity
**Medium** - This affects data integrity and causes confusion for users tracking task priorities.

## Description
When a user marks a task as complete by clicking the checkbox on the Tasks page, the task's priority is unexpectedly changed to "Low", regardless of what the original priority was set to. This behavior is not documented and appears to be unintentional, as there is no business logic requirement for completed tasks to automatically have low priority.

## Steps to Reproduce
1. Navigate to the Tasks page (`/tasks`)
2. Create a new task or identify an existing task with a priority other than "Low" (e.g., "High" or "Medium")
3. Note the current priority badge displayed on the task card
4. Click the checkbox on the left side of the task to mark it as complete
5. Observe the priority badge

## Expected Behavior
When a task is marked as complete via the checkbox:
- The task status should change to "Done"
- The task priority should remain unchanged from its original value
- Only the status should be updated in the database

## Actual Behavior
When a task is marked as complete via the checkbox:
- The task status changes to "Done" ✓
- The task priority is automatically changed to "Low" ✗
- Both status AND priority are updated in the database

## Visual Evidence
Before clicking checkbox:
- Task displays priority badge showing "High" or "Medium"
- Task checkbox is unchecked

## Additional Context
- This behavior occurs only when using the checkbox toggle on the Tasks page
- Editing a task through the "Edit" dialog and manually setting status to "Done" may behave differently
- The issue affects all tasks regardless of their original priority setting
- The bug does NOT occur when toggling a task back from "Done" to "Todo" (priority remains "Low")


**Reported by**: QA Team  
**Date**: November 26, 2025  
**Priority**: Medium  
**Status**: Open
