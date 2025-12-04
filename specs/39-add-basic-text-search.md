# TF-39: Add Basic Text Search for Tasks - Implementation Spec

## Overview

Add real-time text search functionality to the Tasks page, allowing users to filter tasks by name as they type. The search will include a magnifying glass icon and a clear button that appears when text is entered.

## User Story

As a user,
- **I want** to search tasks by name with real-time filtering,
- **so that** I can quickly find specific tasks without scrolling through the entire list.

## Technical Context

### Current Implementation
- Tasks are displayed on `/app/(dashboard)/tasks/page.tsx`
- Task data is fetched server-side via `getAllTasks()` in `/app/(dashboard)/tasks/actions.ts`
- Tasks are rendered client-side in `TaskList` component at `/components/task-list.tsx`
- The page currently shows all tasks with no filtering capability
- UI uses shadcn/ui components with lucide-react icons

### Key Files
- `/app/(dashboard)/tasks/page.tsx` - Server component that renders the Tasks page
- `/app/(dashboard)/tasks/actions.ts` - Server actions for task operations
- `/components/task-list.tsx` - Client component that renders the task cards
- `/components/ui/input.tsx` - Base Input component from shadcn/ui

## Implementation Plan

### Step 1: Create Search Input Component
**Goal**: Build a reusable search input component with icon support

**Files to create**:
- `/components/search-input.tsx`

**Implementation details**:
- Create a client component that wraps the shadcn/ui Input
- Include a Search icon (magnifying glass) on the left side
- Include a clear button (X icon) on the right side that only shows when text is present
- Accept `value`, `onChange`, and `onClear` props
- Use lucide-react's `Search` and `X` icons
- Ensure proper accessibility (aria-labels, keyboard navigation)
- Style consistently with existing UI components

**How to verify**:
- Component renders with magnifying glass icon visible
- Clear button is hidden when value is empty
- Clear button appears when value has text
- Clicking clear button triggers onClear callback
- Component is keyboard accessible

### Step 2: Add Client-Side Filtering Logic
**Goal**: Implement real-time task filtering based on search query

**Files to modify**:
- `/components/task-list.tsx`

**Implementation details**:
- Add state management for search query using `useState`
- Implement a filter function that:
  - Performs case-insensitive substring matching on task names
  - Returns all tasks when search query is empty
  - Returns filtered tasks when search query has text
- Filter the tasks before mapping to render components
- Ensure the filter logic is composable for future integration with status/priority filters

**How to verify**:
- Empty search shows all tasks
- Typing filters tasks in real-time
- Filtering is case-insensitive
- Partial matches work (e.g., "Add vide" matches "Add video conferencing integration")
- Deleting search text restores all tasks
- Optimistic updates still work with filtered list

### Step 3: Integrate Search Input into Tasks Page
**Goal**: Add the search input to the Tasks page UI

**Files to modify**:
- `/app/(dashboard)/tasks/page.tsx`
- `/components/task-list.tsx` (update to accept searchQuery prop)

**Implementation details**:
- Move task list rendering to a new client component wrapper if needed to manage search state
- Position search input below the page header and "New Task" button
- Use a container that matches the existing layout patterns
- Search input should span an appropriate width (full width on mobile, constrained on desktop)
- Pass search state down to TaskList component

**Alternative approach**: 
- Keep page.tsx as server component
- Make TaskList manage its own search state internally
- Add SearchInput at the top of TaskList component

**How to verify**:
- Search input appears in the correct location
- Layout is responsive and matches design
- Search input receives focus when clicked
- Visual styling is consistent with the rest of the page

### Step 4: Add Unit Tests
**Goal**: Ensure search functionality works correctly

**Files to create**:
- `/tests/unit/search-input.test.tsx`
- `/tests/unit/task-search-filter.test.ts`

**Test coverage**:
1. SearchInput component tests:
   - Renders with search icon visible
   - Clear button hidden when empty
   - Clear button shows when text is entered
   - onClear callback fires when clear button clicked
   - onChange callback fires when user types

2. Task filtering logic tests:
   - Returns all tasks when search is empty
   - Filters tasks by name (case-insensitive)
   - Handles partial matches
   - Returns empty array when no matches

**How to verify**:
- Run `npm test` and all tests pass
- Test coverage includes new functionality
- Tests follow existing patterns in the codebase

### Step 5: Add E2E Tests
**Goal**: Validate complete user workflow

**Files to create or modify**:
- `/tests/e2e/tasks.spec.ts` (add new test cases)

**Test scenarios**:
1. Initial state:
   - Search input visible with magnifying glass
   - Clear button not visible
   - All tasks displayed

2. Search workflow:
   - User can type in search input
   - Tasks filter in real-time
   - Clear button appears when text entered

3. Clear workflow:
   - Clicking clear button removes text
   - Clear button disappears
   - All tasks are shown again

4. Manual delete workflow:
   - Manually deleting all text hides clear button
   - All tasks are shown again

**How to verify**:
- Run `npm run test:e2e` and all tests pass
- Tests cover the acceptance criteria from the issue

### Step 6: Manual Testing & Verification
**Goal**: Ensure the feature works as expected in the running application

**Testing steps**:
1. Start the development server (`npm run dev`)
2. Navigate to the Tasks page
3. Verify initial state matches design
4. Test typing in search input
5. Verify real-time filtering
6. Test clear button functionality
7. Test manual text deletion
8. Verify no existing functionality is broken
9. Test on different screen sizes for responsive design

**How to verify**:
- All acceptance criteria from the issue are met
- No console errors or warnings
- Performance is acceptable (no noticeable lag)
- Existing task operations (create, edit, delete, status toggle) still work
- UI matches the Figma design specifications

## Out of Scope (Future Stories)

- Debouncing search input (st006)
- Loading states during search (st007)
- Advanced search operators
- Searching by description, assignee, status, or priority
- Search history or saved searches
- Empty state display for no results (separate story with filter integration)

## Design Decisions

### Case Sensitivity
**Decision**: Case-insensitive search
**Rationale**: Better user experience, users shouldn't need to remember exact casing

### Matching Strategy
**Decision**: Substring matching
**Rationale**: More flexible than full word matching, allows partial queries like "Add vide" to match "Add video conferencing integration"

### Search Scope
**Decision**: Search task names only (not description, assignee, etc.)
**Rationale**: Aligns with the issue requirements and keeps initial implementation simple

### State Management
**Decision**: Client-side filtering with local state
**Rationale**: 
- Keeps implementation simple for MVP
- No API changes needed
- Fast, real-time filtering
- Search state doesn't need to persist across sessions

### Component Architecture
**Decision**: Create reusable SearchInput component
**Rationale**:
- Follows React best practices
- Can be reused elsewhere in the app
- Easier to test in isolation
- Consistent with existing component patterns

## Acceptance Criteria Mapping

### AC1: Initial State
- Search input displays with magnifying glass icon on left ✓ (Step 1, 3)
- Clear button is not visible ✓ (Step 1)
- All tasks displayed ✓ (Step 2)

### AC2: Typing in Search
- Input field receives focus and is ready for text entry ✓ (Step 3)
- Entered text appears in search input ✓ (Step 1, 3)
- Task list filters in real-time ✓ (Step 2)
- Clear button becomes visible ✓ (Step 1)

### AC3: Clear Button Click
- Search input text is removed ✓ (Step 1)
- Clear button no longer visible ✓ (Step 1)
- Task list updates to display all tasks ✓ (Step 2)

### AC4: Manual Text Deletion
- Clear button no longer visible when all text deleted ✓ (Step 1)
- Task list updates to display all tasks ✓ (Step 2)

## Questions

1. Should the search input have a placeholder text? If so, what should it say (e.g., "Search tasks...", "Search by task name...", or something else)?

2. Should we add any animation/transition effects when tasks are filtered in/out, or keep it instant?

3. For accessibility, should the search input announce the number of filtered results to screen readers?

4. Should the search be trimmed (ignore leading/trailing whitespace) or should whitespace be significant?

5. When no tasks match the search query, should we show the empty task list, or should we wait for the separate "empty state" story mentioned in out-of-scope?

6. Should there be a minimum character count before filtering starts (e.g., at least 2 characters), or filter immediately from the first character?

7. The current TaskList component uses optimistic updates for delete and toggle operations. Should search filtering interact with optimistic updates, or should it only filter the current optimistic state?

8. Should we add a data-testid attribute to the search input for easier e2e testing? What naming convention should we follow?
