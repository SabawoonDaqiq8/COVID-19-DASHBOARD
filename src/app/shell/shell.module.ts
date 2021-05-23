import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ShellComponent } from "./components/shell/shell.component";
import {
    FuseProgressBarModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,
} from "@fuse/components";
import { LayoutModule } from "app/layout/layout.module";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FuseSharedModule } from "@fuse/shared.module";

@NgModule({
    imports: [
        CommonModule,
        FuseProgressBarModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
    ],
    declarations: [ShellComponent],
})
export class ShellModule {}
