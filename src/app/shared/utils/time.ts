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
