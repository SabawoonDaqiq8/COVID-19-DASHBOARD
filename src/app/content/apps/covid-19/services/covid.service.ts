import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiService } from "app/core/api/api.service";
import { StyleService } from "app/core/services/style.service";

const routes = {
    getWidgets: () => `/api/covid-dashboard-widgets`,
    countryMetrics: () => `https://api.covid19api.com/summary`,
    worldHistory: () => `https://api.covid19api.com/world`,
};

@Injectable({
    providedIn: "root",
})
export class CovidService {
    widgets: any[];

    /**
     * Constructor
     * @param {HttpClient} _httpClient
     */
    constructor(
        private api: ApiService,
        private _styles: StyleService,
        private _httpClient: HttpClient
    ) {}

    getWidgets(): Observable<any[]> {
        return this.api.get<any>(routes.getWidgets());
    }
    getCountryMetrics(): Observable<any[]> {
        return this.api.get<any>(routes.countryMetrics());
    }
    getWorldHistory(): Observable<any[]> {
        return this.api.get<any>(routes.worldHistory());
    }

    getCaseStyleColor(metricType: string) {
        let color = this._styles.palette.colorInfo;

        if (metricType === "recovered") {
            color = this._styles.palette.colorSuccess;
        } else if (metricType === "deaths") {
            color = this._styles.palette.colorDanger;
        } else if (metricType === "active") {
            color = this._styles.palette.colorPrimary;
        }

        return color;
    }
}
