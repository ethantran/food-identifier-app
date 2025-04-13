import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS support
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Decorator for logging function calls
 */
export function logMethod(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        console.log(`Calling ${propertyName} with args: ${JSON.stringify(args)}`);
        const result = originalMethod.apply(this, args);
        console.log(`${propertyName} returned: ${JSON.stringify(result)}`);
        return result;
    };

    return descriptor;
}

/**
 * Helper to create a delay
 */
export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
} 