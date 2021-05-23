import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import "hammerjs";
import { AppRoutingModule } from "./app-routing.module";
import { ShellModule } from "./shell/shell.module";
import { AuthModule } from "./auth/auth.module";

import { FuseModule } from "@fuse/fuse.module";
import { FuseSharedModule } from "@fuse/shared.module";
import {
    FuseProgressBarModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,
} from "@fuse/components";

import { fuseConfig } from "app/fuse-config";

import { AppComponent } from "app/app.component";
import { LayoutModule } from "app/layout/layout.module";
import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import { FakeDbService } from "./fake-db/fake-db.service";
import { Covid19Module } from "./content/apps/covid-19/covid19.module";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,

        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true,
        }),
        TranslateModule.forRoot(),
        ShellModule,
        AuthModule,
        Covid19Module,
        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        AppRoutingModule,
        // App modules
        LayoutModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
