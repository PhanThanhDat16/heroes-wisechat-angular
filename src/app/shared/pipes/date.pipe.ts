import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  private datePipe = new DatePipe('en-US');

  transform(value: string | Date) {
    const format = 'dd/MM/yyyy HH:mm';
    return this.datePipe.transform(value, format, 'Asia/Ho_Chi_Minh');
  }
}
