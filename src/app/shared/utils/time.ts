export function formatTimeToString(seconds: number, reset24h = false): string {
  let hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (reset24h && hours === 24) {
    hours = 0;
  }

  const hourStr = hours.toString().padStart(2, '0');
  const minuteStr = minutes.toString().padStart(2, '0');

  return `${hourStr}h${minuteStr}`;
}

export function enoughTime(timeRequired: number, cityTimeSeconds: number | undefined, dayEndTimeSeconds: number) {
  return timeRequired + (cityTimeSeconds || 0) <= dayEndTimeSeconds;
}
