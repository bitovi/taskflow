# CSS Styles Style Guide

## Unique Patterns in TaskFlow

### Global CSS Structure
The global stylesheet uses Tailwind CSS base, components, and utilities:

```css
@tailwind base;
@tailwind components; 
@tailwind utilities;
```

### CSS Custom Properties
Color system uses CSS custom properties for theming:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
}
```

### Dark Mode Support
Dark mode variants are defined using CSS custom properties:

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* Additional dark mode properties */
}
```

### Base Layer Customizations
Base layer includes custom styling for HTML elements:

```css
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Utility First Approach
No custom component classes are defined - all styling relies on Tailwind utilities and CSS custom properties.