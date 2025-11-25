/**
 * Utility functions for consistent date handling across the application
 */

/**
 * Convert a date string (YYYY-MM-DD) to a Date object at local noon
 * This prevents timezone issues when storing and displaying dates
 */
export function parseDateString(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day, 12, 0, 0) // month is 0-indexed, set to noon
}

/**
 * Convert a Date object to YYYY-MM-DD string format
 * Uses local date components to avoid timezone shifts
 */
export function formatDateForInput(date: Date | string): string {
    let dateObj: Date
    if (typeof date === 'string') {
        // If string looks like YYYY-MM-DD, parse to local noon to avoid timezone shifts
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            dateObj = parseDateString(date)
        } else {
            dateObj = new Date(date)
        }
    } else {
        dateObj = date
    }
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

/**
 * Format a date for display (e.g., "Aug 08")
 * Handles date consistently to avoid timezone issues
 */
export function formatDateForDisplay(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date

    // Get month names
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    const month = months[dateObj.getMonth()]
    const day = String(dateObj.getDate()).padStart(2, '0')

    return `${month} ${day}`
}
