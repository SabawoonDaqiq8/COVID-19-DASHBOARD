import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
} from "@angular/core";
import { MetricValue } from "../../models/metrics";

@Component({
    selector: "fuse-covid19-cases-worldwide",
    templateUrl: "./covid19-cases-worldwide.component.html",
    styleUrls: ["./covid19-cases-worldwide.component.scss"],
})
export class Covid19CasesWorldwideComponent implements OnChanges, OnInit {
    confirmed: any;
    active: any;
    recovered: any;
    deaths: any;

    stacked: any[] = [];

    // icons = {
    //     circle: faCircle,
    //     up: faArrowCircleUp,
    //     down: faArrowCircleDown,
    //     unvariant: faStopCircle,
    //     search: faSearch,
    // };

    maxStacked: number;
    metricsToDisplay: any[];

    @Input()
    metrics: any[];

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.metrics && changes.metrics.currentValue) {
            const metrics = changes.metrics.currentValue as any[];
            this.metricsToDisplay = metrics.filter(
                (metric) => metric.type !== "confirmed"
            );

            this.confirmed = this.getCase("confirmed", metrics);
            this.active = this.getCase("active", metrics);
            this.recovered = this.getCase("recovered", metrics);
            this.deaths = this.getCase("deaths", metrics);

            let maxStacked: number = 0;
            this.metricsToDisplay.forEach((metric) => {
                this.stacked.push({
                    value: metric.total,
                    type: this.getClass(metric),
                });

                maxStacked += metric.total;
            });

            this.maxStacked = maxStacked;
        }
    }

    private getCase(type: string, metrics: any[]) {
        return metrics.find((metric) => metric.type === type);
    }

    ngOnInit(): void {
        console.log(this.metrics);
    }

    getClass(metric: any) {
        let cls = "accent";

        if (metric.type === "recovered") {
            cls = "cyan";
        } else if (metric.type === "deaths") {
            cls = "warn";
        }

        return cls;
    }

    // getVariationIcon(value: MetricValue) {
    //     const variation = this.getVariation(value);
    //     return variation == 0
    //         ? this.icons.unvariant
    //         : variation > 0
    //         ? this.icons.up
    //         : this.icons.down;
    // }

    getVariation(value: MetricValue) {
        return value.today - value.yesterday;
    }

    getFlexValue(stack: any) {
        console.log(stack);
    }
}
