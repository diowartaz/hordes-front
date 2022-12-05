export function getTimeString(seconds: number): any {
  let nbHeures = Math.floor(seconds / 3600);
  let nbMinutesInSeconds: number = (seconds - nbHeures * 3600) % 3600;
  let nbMinutes: number = Math.floor(nbMinutesInSeconds / 36);
  let nbMinutesString: string = nbMinutes + '';
  if (nbMinutes < 10) {
    nbMinutesString = '0' + nbMinutes;
  }
  return nbHeures + 'h' + nbMinutesString;
}
