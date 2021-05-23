import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Platform } from "@angular/cdk/platform";
import { TranslateService } from "@ngx-translate/core";

import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";

import { locale as navigationEnglish } from "app/navigation/i18n/en";
import { locale as navigationIndonesian } from "app/navigation/i18n/id";

@Component({
    selector: "app",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
    fuseConfig: any;
    navigation: any;

    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform
    ) {
        // Add languages
        this._translateService.addLangs(["en", "id"]);

        // Set the default language
        this._translateService.setDefaultLang("en");

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(
            navigationEnglish,
            navigationIndonesian
        );

        // Use a language
        this._translateService.use("en");

        // Add is-mobile class to the body if the platform is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add("is-mobile");
        }
    }
    ngOnInit(): void {}
}
