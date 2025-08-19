# Documentation Style Guide

## Unique Patterns in TaskFlow

### README Structure
Project documentation follows standard format with specific sections:

```markdown
# Project Title
Brief description

## Features
- Bullet point list of key features

## Technology Stack  
- List of technologies used

## Getting Started
### Prerequisites
### Installation
### Usage

## Project Structure
Directory tree explanation

## Contributing
Guidelines for contributions
```

### Code Documentation
- Utility functions include JSDoc comments
- Complex logic includes inline comments explaining business rules
- Type definitions include descriptive names that explain purpose

### Technical Documentation Convention
Generated documentation (like this instruction generation) follows:

```markdown
# Domain Title

## Implementation Section
Code examples with explanations

### Subsection Pattern
Specific patterns with code examples

## Another Major Section
Additional information
```

### Comment Style in Code
```typescript
/**
 * Detailed function description
 * Explains purpose and any gotchas
 */
export function utilityFunction() {
  // Inline comments for complex logic
}
```

### Instruction Generation Documentation
- Step-by-step methodology documentation
- Intermediate results preserved in `.instruction-generation-results/`
- Final consolidated documentation in `.github/copilot-instructions.md`

### File Organization for Docs
- Root README.md for project overview
- Technical documentation in `.instruction-generation-results/`
- Implementation guides organized by domain/category
- Style guides for each file category