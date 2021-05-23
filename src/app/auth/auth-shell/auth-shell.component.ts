import { Component, Inject, OnInit } from "@angular/core";
import { DOCUMENT } from "@angular/common";

import { CredentialsService } from "app/core/services/credentials.service";
import { RedirectService } from "app/core/services/redirect.service";
import { FuseSplashScreenService } from "@fuse/services/splash-screen.service";

@Component({
    selector: "prx-auth-shell",
    templateUrl: "./auth-shell.component.html",
    styleUrls: ["./auth-shell.component.scss"],
})
export class AuthShellComponent implements OnInit {
    fuseConfig: any;
    error: string;

    constructor(
        @Inject(DOCUMENT) private document: any,
        private _credentials: CredentialsService,
        private _redirect: RedirectService,
        private _fuseSplashScreenService: FuseSplashScreenService
    ) {
        if (this._credentials.isAuthenticated()) {
            this.redirect();
        }
    }

    ngOnInit() {
        this.document.body.classList.add("theme-default");
    }

    redirect() {
        this._redirect.toCovid();
    }
}
