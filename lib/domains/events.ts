export function shouldResetOnEvent(resetOn: string | string[] | { event: string; amount: number }[] | undefined, eventType: string): boolean {
  if (!resetOn) return false;

  if (typeof resetOn === "string") {
    return resetOn === eventType;
  }

  if (Array.isArray(resetOn)) {
    // Check if it's an array of strings
    if (resetOn.length > 0 && typeof resetOn[0] === "string") {
      return (resetOn as string[]).includes(eventType);
    }
    // Check if it's an array of objects with event and amount
    if (resetOn.length > 0 && typeof resetOn[0] === "object" && "event" in resetOn[0]) {
      return (resetOn as { event: string; amount: number }[]).some(item => item.event === eventType);
    }
  }

  return false;
}

export function getResetAmount(resetOn: string | string[] | { event: string; amount: number }[] | undefined, eventType: string): number | undefined {
  if (!resetOn) return undefined;

  if (typeof resetOn === "string" || (Array.isArray(resetOn) && typeof resetOn[0] === "string")) {
    return undefined; // Full reset
  }

  if (Array.isArray(resetOn) && resetOn.length > 0 && typeof resetOn[0] === "object" && "event" in resetOn[0]) {
    const matchingEvent = (resetOn as { event: string; amount: number }[]).find(item => item.event === eventType);
    return matchingEvent?.amount;
  }

  return undefined;
}
