/**
 * Formatting utilities for dates, times, numbers, and strings
 */

interface TimeFormatOptions {
    showSeconds?: boolean;
    showDate?: boolean;
    use24Hour?: boolean;
}

/**
 * Formats a timestamp into a human-readable time string
 * @param timestamp Unix timestamp in milliseconds
 * @param options Formatting options
 * @example
 * ```typescript
 * // Basic usage - returns "3:45 PM"
 * formatTime(Date.now())
 *
 * // With seconds - returns "3:45:30 PM"
 * formatTime(Date.now(), { showSeconds: true })
 *
 * // With date - returns "Jan 24, 3:45 PM"
 * formatTime(Date.now(), { showDate: true })
 *
 * // 24-hour format - returns "15:45"
 * formatTime(Date.now(), { use24Hour: true })
 *
 * // Multiple options - returns "Jan 24, 15:45:30"
 * formatTime(Date.now(), {
 *   showDate: true,
 *   showSeconds: true,
 *   use24Hour: true
 * })
 * ```
 */
export function formatTime(
    timestamp: number,
    {
        showSeconds = false,
        showDate = false,
        use24Hour = false
    }: TimeFormatOptions = {}
): string {
    const date = new Date(timestamp);

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        ...(showSeconds && { second: '2-digit' }),
        hour12: !use24Hour
    };

    if (showDate) {
        return date.toLocaleString(undefined, {
            ...timeOptions,
            month: 'short',
            day: 'numeric'
        });
    }

    return date.toLocaleTimeString(undefined, timeOptions);
}

/**
 * Formats a date relative to now (e.g., "2 minutes ago")
 * @param timestamp Unix timestamp in milliseconds
 * @example
 * ```typescript
 * formatRelativeTime(Date.now() - 5000)  // "just now"
 * formatRelativeTime(Date.now() - 120000)  // "2 minutes ago"
 * formatRelativeTime(Date.now() - 3600000)  // "1 hour ago"
 * ```
 */
export function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 30) return 'just now';
    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;

    return formatTime(timestamp, { showDate: true });
}

/**
 * Groups timestamps by date for chat message grouping
 * @param timestamp Unix timestamp in milliseconds
 * @example
 * ```typescript
 * // Returns "Today", "Yesterday", or "January 24, 2024"
 * formatMessageDate(timestamp)
 * ```
 */
export function formatMessageDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
        return 'Today';
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }

    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}