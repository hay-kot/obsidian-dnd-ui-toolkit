/**
 * Deeply merges a source object (which may be nullable/have optional properties)
 * with a default object containing sensible defaults for all properties.
 *
 * @param source The source object with optional properties (may be null/undefined)
 * @param defaults The default object with sensible defaults for all properties
 * @returns A new object with values from source where available, falling back to defaults
 */
export function mergeWithDefaults<T extends Record<string, unknown>>(
  source: Partial<T> | null | undefined,
  defaults: T
): T {
  // If source is null or undefined, return a copy of defaults
  if (source == null) {
    return { ...defaults };
  }

  const result = { ...defaults };

  // Iterate through all properties in the source object
  for (const key in source) {
    const sourceValue = source[key];
    const defaultValue = defaults[key];

    // If the current property exists in the source
    if (key in source) {
      // Handle nested objects recursively
      if (
        sourceValue !== null &&
        sourceValue !== undefined &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue) &&
        defaultValue !== null &&
        defaultValue !== undefined &&
        typeof defaultValue === "object" &&
        !Array.isArray(defaultValue)
      ) {
        // Recursively merge nested objects
        // @ts-expect-error
        result[key] = mergeWithDefaults(sourceValue, defaultValue);
      } else {
        // For non-objects or arrays, use source value if it's not null/undefined,
        // otherwise use the default
        // @ts-expect-error
        result[key] = sourceValue !== undefined && sourceValue !== null ? sourceValue : defaultValue;
      }
    }
  }

  return result;
}
