import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";

@Pipe({
    name: "datefromnow",
})
export class DateFromNowPipe implements PipeTransform {
    constructor() {}

    transform(value: any): any {
        debugger;
        if (!value) {
            return "No Date found";
        }
        return moment(value).fromNow();
    }
}
