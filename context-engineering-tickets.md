Sample features you can attempt to implement with Copilot's help. As Copilot works, think about how the `copilot-instructions.md` file can be updated to changed to make the implementations better.

Alternatively, try removing things from the instructions file and see how it affects Copilot's work. Does it change the outcome?

---

TF-1
Feature: Task Priority Badges

As a team member
I want to see a colored badge representing each task’s priority
So that I can quickly identify which tasks are most important

Scenario: Display priority badges in task list `/tasks` and Kanban board `/board`
Given there are tasks with low, medium, and high priority levels
When I view the task list
Then each task displays a priority badge
And the badge label matches the task’s priority
And each priority uses a distinct, consistent color

---

TF-2
Feature: Filter Tasks by Multiple Statuses

As a user on the Kanban board `/board`
I want to filter tasks by selecting multiple statuses
So that I can see all tasks matching any of the selected statuses

Scenario: Filter tasks by multiple statuses
Given there are tasks with various statuses on the board
When I select "In Progress" and "Done" from the status filters
Then tasks with status "In Progress" are visible
And tasks with status "Done" are visible
And tasks with other statuses are hidden

---

TF-3
Feature: Task Search

As a user on the tasks page `/tasks`
I want to search for tasks by title or description
So that I can quickly find relevant tasks

Scenario: Search tasks by keyword
Given there are tasks with various titles and descriptions
When I type a keyword into the search input
Then only tasks whose title or description contains the keyword are displayed
And the results update in real time as I type

---

TF-4
Feature: Bulk Task Actions

As a user
I want to perform actions on multiple tasks at once on the tasks page `/tasks`
So that I can manage tasks more efficiently

Scenario: Change status of multiple tasks
Given multiple tasks are selected
When I choose "Mark as Done" from the bulk actions menu
Then all selected tasks have their status updated to "Done"

Scenario: Delete multiple tasks
Given multiple tasks are selected
When I choose "Delete" from the bulk actions menu
Then I am prompted to confirm the deletion
And all selected tasks are removed after confirmation

Scenario: Deselect all tasks
Given multiple tasks are selected
When I click "Deselect All"
Then no tasks remain selected

---

TF-5
Feature: Task Sorting

As a user
I want to sort tasks by different criteria on the tasks page `/tasks`
So that I can view tasks in the most useful order

Scenario: Sort tasks by due date
Given tasks have different due dates
When I select "Sort by Due Date"
Then tasks are ordered by earliest due date first

Scenario: Sort tasks by priority
Given tasks have different priority levels
When I select "Sort by Priority"
Then tasks are ordered from highest to lowest priority

Scenario: Sort tasks by assignee
Given tasks are assigned to different users
When I select "Sort by Assignee"
Then tasks are grouped or ordered by assignee name

Scenario: Reset sorting
Given a custom sort is applied
When I select "Default Order"
Then tasks return to their original sorting order

---

TF-6
Feature: User Profile Settings
As a user
I want to update my profile information and avatar
So that my account reflects my current details

Scenario: Update display name
Given I am on the profile settings page
When I enter a new display name
And I save my changes
Then my display name should be updated throughout the application

Scenario: Update email address
Given I am on the profile settings page
When I enter a new email address
And I save my changes
Then my email address should be updated in my account settings

Scenario: View current profile information
Given I am logged in
When I navigate to the profile settings page
Then I should see my current display name, email, and avatar

Scenario: Cancel profile changes
Given I have made changes to my profile settings
When I click the "Cancel" button
Then my changes should not be saved
And my profile information should remain unchanged
