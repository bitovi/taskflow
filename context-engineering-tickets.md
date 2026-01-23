TF-1  
Feature: Task Priority Badges

As a team member

- I want to see a colored badge representing each task’s priority
- So that I can quickly identify which tasks are most important

Scenario: Display priority badges in task list `/tasks` and Kanban board `/board`

- **GIVEN** there are tasks with low, medium, and high priority levels
- **WHEN** I view the task list
- **THEN** each task displays a priority badge
  - And the badge label matches the task’s priority
  - And each priority uses a distinct, consistent color

---

TF-2  
Feature: Filter Tasks by Multiple Statuses

As a user on the Kanban board `/board`

- I want to filter tasks by selecting multiple statuses
- So that I can see all tasks matching any of the selected statuses

Scenario: Filter tasks by multiple statuses

- **GIVEN** there are tasks with various statuses on the board
- **WHEN** I select "In Progress" and "Done" from the status filters
- **THEN** tasks with status "In Progress" are visible
  - And tasks with status "Done" are visible
  - And tasks with other statuses are hidden

---

TF-3  
Feature: Task Search

As a user on the tasks page `/tasks`

- I want to search for tasks by title or description
- So that I can quickly find relevant tasks

Scenario: Search tasks by keyword

- **GIVEN** there are tasks with various titles and descriptions
- **WHEN** I type a keyword into the search input
- **THEN** only tasks whose title or description contains the keyword are displayed
  - And the results update in real time as I type

---

TF-4  
Feature: Bulk Task Actions

As a user

- I want to perform actions on multiple tasks at once on the tasks page `/tasks`
- So that I can manage tasks more efficiently

Scenario: Change status of multiple tasks

- **GIVEN** multiple tasks are selected
- **WHEN** I choose "Mark as Done" from the bulk actions menu
- **THEN** all selected tasks have their status updated to "Done"

Scenario: Delete multiple tasks

- **GIVEN** multiple tasks are selected
- **WHEN** I choose "Delete" from the bulk actions menu
- **THEN** I am prompted to confirm the deletion
  - And all selected tasks are removed after confirmation

Scenario: Deselect all tasks

- **GIVEN** multiple tasks are selected
- **WHEN** I click "Deselect All"
- **THEN** no tasks remain selected

---

TF-5  
Feature: Task Sorting

As a user

- I want to sort tasks by different criteria on the tasks page `/tasks`
- So that I can view tasks in the most useful order

Scenario: Sort tasks by due date

- **GIVEN** tasks have different due dates
- **WHEN** I select "Sort by Due Date"
- **THEN** tasks are ordered by earliest due date first

Scenario: Sort tasks by priority

- **GIVEN** tasks have different priority levels
- **WHEN** I select "Sort by Priority"
- **THEN** tasks are ordered from highest to lowest priority

Scenario: Sort tasks by assignee

- **GIVEN** tasks are assigned to different users
- **WHEN** I select "Sort by Assignee"
- **THEN** tasks are grouped or ordered by assignee name

Scenario: Reset sorting

- **GIVEN** a custom sort is applied
- **WHEN** I select "Default Order"
- **THEN** tasks return to their original sorting order

---

TF-6  
Feature: User Profile Settings

As a user

- I want to update my profile information and avatar
- So that my account reflects my current details

Scenario: Update display name

- **GIVEN** I am on the profile settings page
- **WHEN** I enter a new display name
  - And I save my changes
- **THEN** my display name should be updated throughout the application

Scenario: Update email address

- **GIVEN** I am on the profile settings page
- **WHEN** I enter a new email address
  - And I save my changes
- **THEN** my email address should be updated in my account settings

Scenario: View current profile information

- **GIVEN** I am logged in
- **WHEN** I navigate to the profile settings page
- **THEN** I should see my current display name, email, and avatar

Scenario: Cancel profile changes

- **GIVEN** I have made changes to my profile settings
- **WHEN** I click the "Cancel" button
- **THEN** my changes should not be saved
  - And my profile information should remain unchanged
