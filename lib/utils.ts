import * as React from "react";

// Simple utility for conditionally joining class names
export function cn(...classes: any[]): string {
    return classes.filter(Boolean).join("  ");
}

export const DEBUG_MODE = true;

const [globalState, setGlobalState] = React.useState(null);
