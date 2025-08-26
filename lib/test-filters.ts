/**
 * Test suite for the search and filter functionality
 * This validates the filtering logic used in TasksPageClient
 */

import { mockTasks, testScenarios } from './test-data';

// Replicate the filtering logic from TasksPageClient
function filterTasks(tasks: typeof mockTasks, searchQuery: string, priorityFilter: string, statusFilter: string) {
  let filtered = tasks;

  // Apply search filter
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(task => 
      task.name.toLowerCase().includes(query) || 
      task.description.toLowerCase().includes(query)
    );
  }

  // Apply priority filter
  if (priorityFilter !== 'all') {
    filtered = filtered.filter(task => task.priority === priorityFilter);
  }

  // Apply status filter
  if (statusFilter !== 'all') {
    filtered = filtered.filter(task => task.status === statusFilter);
  }

  return filtered;
}

// Run tests
function runTests() {
  console.log('🧪 Running Search and Filter Tests\n');

  let passedTests = 0;
  const totalTests = testScenarios.length;

  testScenarios.forEach((scenario, index) => {
    const {
      name,
      searchQuery = '',
      priorityFilter = 'all',
      statusFilter = 'all',
      expectedResults
    } = scenario;

    const results = filterTasks(mockTasks, searchQuery, priorityFilter, statusFilter);
    const passed = results.length === expectedResults;

    console.log(`Test ${index + 1}: ${name}`);
    console.log(`  Filters: search="${searchQuery}", priority="${priorityFilter}", status="${statusFilter}"`);
    console.log(`  Expected: ${expectedResults}, Got: ${results.length}`);
    console.log(`  ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (passed) {
      passedTests++;
    } else {
      console.log(`  Matching tasks:`, results.map(t => t.name));
    }
    console.log('');
  });

  console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The search and filter functionality is working correctly.');
  } else {
    console.log('❌ Some tests failed. Please review the filtering logic.');
  }
}

// Additional manual tests
function runManualTests() {
  console.log('\n🔍 Manual Test Cases\n');

  // Test 1: Empty search should return all tasks
  const allTasks = filterTasks(mockTasks, '', 'all', 'all');
  console.log(`Empty filters: ${allTasks.length}/${mockTasks.length} tasks (should be equal)`);

  // Test 2: Case insensitive search
  const caseInsensitive1 = filterTasks(mockTasks, 'LOGIN', 'all', 'all');
  const caseInsensitive2 = filterTasks(mockTasks, 'login', 'all', 'all');
  console.log(`Case insensitive search: ${caseInsensitive1.length} === ${caseInsensitive2.length} (should be equal)`);

  // Test 3: Multiple filters combined
  const combined = filterTasks(mockTasks, '', 'high', 'in_progress');
  console.log(`High priority + In Progress: ${combined.length} tasks`);
  console.log(`Tasks:`, combined.map(t => `"${t.name}" (${t.priority}, ${t.status})`));

  // Test 4: Search in description
  const descriptionSearch = filterTasks(mockTasks, 'performance', 'all', 'all');
  console.log(`Description search "performance": ${descriptionSearch.length} tasks`);
  console.log(`Tasks:`, descriptionSearch.map(t => t.name));
}

export { runTests, runManualTests };

// If running directly
if (typeof window === 'undefined' && require.main === module) {
  runTests();
  runManualTests();
}