export function getTimeString(seconds: number): any {
  // console.log("seconds", seconds)
  let nbHeures = Math.floor(seconds / 3600);
  let nbMinutesInSeconds: number = (seconds - nbHeures * 3600);
  let nbMinutes: number = Math.floor(nbMinutesInSeconds / 60);
  let nbMinutesString: string = nbMinutes + '';
  if (nbMinutes < 10) {
    nbMinutesString = '0' + nbMinutes;
  }

  let nbHeuresString: string = nbHeures + '';
  if (nbHeures == 24) {
    nbHeuresString = '00';
  }
  return nbHeuresString + 'h' + nbMinutesString;
}
