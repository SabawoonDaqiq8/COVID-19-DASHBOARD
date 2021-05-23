import {
    Component,
    OnInit,
    NgZone,
    AfterViewInit,
    ViewEncapsulation,
    Input,
} from "@angular/core";
import { CountryMetric, MetricValue } from "../../models/metrics";
import { finalize, takeUntil } from "rxjs/operators";
import { CovidService } from "../../services/covid.service";
import { fuseAnimations } from "@fuse/animations";
import { Subject } from "rxjs";
import { FuseMatSidenavHelperService } from "@fuse/directives/fuse-mat-sidenav/fuse-mat-sidenav.service";
import { MediaObserver } from "@angular/flex-layout";

@Component({
    selector: "fuse-covid19-cases-by-country",
    templateUrl: "./covid19-cases-by-country.component.html",
    styleUrls: ["./covid19-cases-by-country.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class Covid19CasesByCountryComponent implements OnInit {
    countryModel: string;
    selectedCountry: any;

    icons = {
        map: "map",
        up: "arrow_upward",
        down: "arrow_downward",
        unvariant: "stop",
        search: "search",
    };

    searchText: string = "";

    @Input()
    world: any;

    @Input()
    countries: any[];

    constructor(
        private _covid: CovidService,
        private _fuseMatSidenavHelperService: FuseMatSidenavHelperService,
        public _mediaObserver: MediaObserver
    ) {
        this.selectCountry(this.world);
    }

    ngOnInit(): void {}

    getVariationIcon(value: any) {
        const variation = this.getVariation(value);
        return variation == 0
            ? this.icons.unvariant
            : variation > 0
            ? this.icons.up
            : this.icons.down;
    }

    getVariation(value: any) {
        return value.today - value.yesterday;
    }

    selectCountry(country: any) {
        this.selectedCountry = country;
    }
}
