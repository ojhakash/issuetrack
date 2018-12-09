import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "startDateFilter"
})
export class StartDateFilterPipe implements PipeTransform {
  transform(items: any[], startDate: Date): any {
    if (!items) return [];
    if (!startDate) return items;
    return items.filter(it => {
      return it.createdAt >= startDate;
    });
  }
}
