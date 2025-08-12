import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitletter'
})
export class LimitletterPipe implements PipeTransform {


  transform(value: string, limit: number = 35, trail: string = '...'): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }

}
