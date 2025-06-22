export function shouldResetOnEvent(resetOn: string | string[] | undefined, eventType: string): boolean {
  if (!resetOn) return false;

  if (typeof resetOn === "string") {
    return resetOn === eventType;
  }

  if (Array.isArray(resetOn)) {
    return resetOn.includes(eventType);
  }

  return false;
}
