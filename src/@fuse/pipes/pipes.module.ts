import { NgModule } from "@angular/core";

import { KeysPipe } from "./keys.pipe";
import { GetByIdPipe } from "./getById.pipe";
import { HtmlToPlaintextPipe } from "./htmlToPlaintext.pipe";
import { FilterPipe } from "./filter.pipe";
import { CamelCaseToDashPipe } from "./camelCaseToDash.pipe";
import { DateFromNowPipe } from "./dateFromNow.pipe";

@NgModule({
    declarations: [
        KeysPipe,
        GetByIdPipe,
        HtmlToPlaintextPipe,
        FilterPipe,
        CamelCaseToDashPipe,
        DateFromNowPipe,
    ],
    imports: [],
    exports: [
        KeysPipe,
        GetByIdPipe,
        HtmlToPlaintextPipe,
        FilterPipe,
        CamelCaseToDashPipe,
        DateFromNowPipe,
    ],
})
export class FusePipesModule {}
