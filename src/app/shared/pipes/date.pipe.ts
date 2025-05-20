import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from '@angular/common';
@Pipe({
    name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

     private datePipe = new DatePipe('vi');

    transform(value: string | Date ) {
      const format: string = 'dd/MM/yyyy'
      return this.datePipe.transform(value, format, 'Asia/Ho_Chi_Minh')
    }   
}