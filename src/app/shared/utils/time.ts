export function formatTimeToString(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const hourStr = hours.toString().padStart(2, '0');
  const minuteStr = minutes.toString().padStart(2, '0');

  return `${hourStr}h${minuteStr}`;
}

export function enoughTime(timeRequired: number, cityTimeSeconds: number | undefined, dayEndTimeSeconds: number) {
  return timeRequired + (cityTimeSeconds || 0) <= dayEndTimeSeconds;
}

/** Durée réelle restante : "3h 12m", puis "09:41" sous 10 minutes */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  if (totalSeconds < 10 * 60) {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes.toString().padStart(2, '0')}m` : `${minutes}m`;
}
