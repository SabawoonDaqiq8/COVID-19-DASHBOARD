import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { fuseAnimations } from "@fuse/animations";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { CovidService } from "../services/covid.service";

import { locale as english } from "./../i18n/en";
import { locale as indonesian } from "./../i18n/id";

@Component({
    selector: "covid-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CovidDashboardComponent implements OnInit {
    countries: any[];
    world: any;
    metrics: any[] = [];
    widget5SelectedDay = "today";

    /**
     * Constructor
     *
     * @param {_covid} CovidService
     */
    constructor(
        private _covid: CovidService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            english,
            indonesian
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the widgets from the service
        this.getCovidDashboardData();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------
    getCovidDashboardData() {
        this._covid.getCountryMetrics().subscribe((metrics: any) => {
            this.countries = metrics.Countries;
            this.countries.sort((a, b) => b.NewConfirmed - a.NewConfirmed);

            this.world = {
                name: "World",
                code: "global",
                confirmed: {
                    new: metrics.Global.NewConfirmed,
                    total: metrics.Global.TotalConfirmed,
                },
                recovered: {
                    new: metrics.Global.NewRecovered,
                    total: metrics.Global.TotalRecovered,
                },
                deaths: {
                    new: metrics.Global.NewDeaths,
                    total: metrics.Global.TotalDeaths,
                },
            };
            this.metrics.push({
                total:
                    metrics.Global.TotalConfirmed -
                    (metrics.Global.TotalRecovered +
                        metrics.Global.TotalDeaths),
                type: "active",
                variation:
                    metrics.Global.TotalConfirmed -
                    (metrics.Global.TotalRecovered +
                        metrics.Global.TotalDeaths) -
                    metrics.Global.NewConfirmed -
                    (metrics.Global.NewConfirmed + metrics.Global.NewConfirmed),
                new:
                    metrics.Global.NewConfirmed -
                    (metrics.Global.NewRecovered + metrics.Global.NewDeaths),
            });
            this.metrics.push({
                total: metrics.Global.TotalConfirmed,
                type: "confirmed",
                variation:
                    metrics.Global.TotalConfirmed - metrics.Global.NewConfirmed,
                new: metrics.Global.NewConfirmed,
            });
            this.metrics.push({
                total: metrics.Global.TotalRecovered,
                type: "recovered",
                variation:
                    metrics.Global.TotalRecovered - metrics.Global.NewRecovered,
                new: metrics.Global.NewRecovered,
            });
            this.metrics.push({
                total: metrics.Global.TotalDeaths,
                type: "deaths",
                variation:
                    metrics.Global.TotalDeaths - metrics.Global.NewDeaths,
                new: metrics.Global.NewDeaths,
            });
        });
    }
}
