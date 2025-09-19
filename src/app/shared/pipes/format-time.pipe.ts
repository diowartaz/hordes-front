import { Pipe, PipeTransform } from '@angular/core';
import { formatTimeToString } from '../utils/time';

@Pipe({
  name: 'formatTime',
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    return formatTimeToString(value);
  }
}
