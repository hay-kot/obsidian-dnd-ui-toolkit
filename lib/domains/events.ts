import { ResetConfig } from "lib/types";

export function normalizeResetConfig(
  resetOn: string | string[] | { event: string; amount: number }[] | undefined
): ResetConfig[] | undefined {
  if (!resetOn) return undefined;

  if (typeof resetOn === "string") {
    return [{ event: resetOn }];
  }

  if (Array.isArray(resetOn)) {
    // Check if it's an array of strings
    if (resetOn.length > 0 && typeof resetOn[0] === "string") {
      return (resetOn as string[]).map((event) => ({ event }));
    }
    // Check if it's already an array of objects
    if (resetOn.length > 0 && typeof resetOn[0] === "object" && "event" in resetOn[0]) {
      return resetOn as ResetConfig[];
    }
  }

  return undefined;
}

export function shouldResetOnEvent(resetOn: ResetConfig[] | undefined, eventType: string): boolean {
  if (!resetOn) return false;
  return resetOn.some((config) => config.event === eventType);
}

export function getResetAmount(resetOn: ResetConfig[] | undefined, eventType: string): number | undefined {
  if (!resetOn) return undefined;
  const matchingEvent = resetOn.find((config) => config.event === eventType);
  return matchingEvent?.amount;
}
