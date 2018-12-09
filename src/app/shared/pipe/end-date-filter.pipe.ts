import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "endDateFilter"
})
export class EndDateFilterPipe implements PipeTransform {
  transform(items: any[], endDate: Date): any {
    if (!items) return [];
    if (!endDate) return items;
    return items.filter(it => {
      return it.createdAt <= endDate;
    });
  }
}
