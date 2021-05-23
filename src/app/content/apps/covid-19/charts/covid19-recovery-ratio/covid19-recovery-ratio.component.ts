import {
    Component,
    Input,
    SimpleChanges,
    OnChanges,
    NgZone,
    AfterViewInit,
} from "@angular/core";
import { GlobalMetric } from "../../models/metrics";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { StyleService } from "app/core/services/style.service";

am4core.useTheme(am4themes_animated);

@Component({
    selector: "fuse-covid19-recovery-ratio",
    templateUrl: "./covid19-recovery-ratio.component.html",
    styleUrls: ["./covid19-recovery-ratio.component.scss"],
})
export class Covid19RecoveryRatioComponent implements OnChanges, AfterViewInit {
    private ratioChart: am4charts.RadarChart;
    metricsToDisplay: any[];

    @Input()
    metrics: any[];

    constructor(private zone: NgZone, private _styles: StyleService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.metrics && changes.metrics.currentValue) {
            this.metricsToDisplay = changes.metrics
                .currentValue as GlobalMetric[];
        }
    }

    ngAfterViewInit() {
        if (this.metricsToDisplay) {
            this.loadChart(this.metricsToDisplay);
        }
    }

    loadChart(metrics: any[]) {
        this.zone.runOutsideAngular(() => {
            let chart = am4core.create("ratioChart", am4charts.RadarChart);

            const confirmed = metrics.find(
                (metric) => metric.type === "confirmed"
            );
            const data = metrics
                .filter((metric) => metric.type !== "confirmed")
                .reverse();

            chart.data = data.map((metric: any) => {
                return {
                    category: metric.type.replace(/^\w/, (c) =>
                        c.toUpperCase()
                    ),
                    value: (metric.total / confirmed.total) * 100,
                    full: 100,
                };
            });

            this.configureChart(chart);

            this.ratioChart = chart;
        });
    }

    private configureChart(chart: am4charts.RadarChart) {
        // Make chart not full circle
        chart.startAngle = -90;
        chart.endAngle = 180;
        chart.innerRadius = am4core.percent(20);

        // Set number format
        chart.numberFormatter.numberFormat = "#.#'%'";

        // Create axes
        let categoryAxis = chart.yAxes.push(
            new am4charts.CategoryAxis<am4charts.AxisRendererRadial>()
        );
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.grid.template.strokeOpacity = 0;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.adapter.add(
            "fill",
            (fill, target) => {
                if (target.dataItem.properties.category == "Active") {
                    return am4core.color(this._styles.palette.colorPrimary);
                }

                if (target.dataItem.properties.category == "Recovered") {
                    return am4core.color(this._styles.palette.colorSuccess);
                }

                if (target.dataItem.properties.category == "Deaths") {
                    return am4core.color(this._styles.palette.colorDanger);
                }

                return am4core.color(this._styles.palette.colorDark);
            }
        );
        categoryAxis.renderer.minGridDistance = 10;

        let valueAxis = chart.xAxes.push(
            new am4charts.ValueAxis<am4charts.AxisRendererCircular>()
        );
        valueAxis.renderer.grid.template.strokeOpacity = 0;
        valueAxis.min = 0;
        valueAxis.max = 100;
        valueAxis.strictMinMax = true;

        valueAxis.renderer.labels.template.fill = am4core.color(
            this._styles.palette.colorGray
        );

        // Create series
        let series1 = chart.series.push(new am4charts.RadarColumnSeries());
        series1.dataFields.valueX = "full";
        series1.dataFields.categoryY = "category";
        series1.clustered = false;
        series1.columns.template.fill = new am4core.InterfaceColorSet().getFor(
            "alternativeBackground"
        );
        series1.columns.template.fillOpacity = 0.08;
        series1.columns.template["cornerRadiusTopLeft"] = 20;
        series1.columns.template.strokeWidth = 0;
        series1.columns.template.radarColumn.cornerRadius = 20;

        let series2 = chart.series.push(new am4charts.RadarColumnSeries());
        series2.dataFields.valueX = "value";
        series2.dataFields.categoryY = "category";
        series2.clustered = false;
        series2.columns.template.strokeWidth = 0;
        series2.columns.template.tooltipText = "{category}: [bold]{value}[/]";
        series2.columns.template.radarColumn.cornerRadius = 20;

        series2.columns.template.adapter.add("fill", (fill, target) => {
            if (target.dataItem.categories.categoryY == "Active") {
                return am4core.color(this._styles.palette.colorPrimary);
            }

            if (target.dataItem.categories.categoryY == "Recovered") {
                return am4core.color(this._styles.palette.colorSuccess);
            }

            if (target.dataItem.categories.categoryY == "Deaths") {
                return am4core.color(this._styles.palette.colorDanger);
            }

            return am4core.color(this._styles.palette.colorDark);
        });

        // Add cursor
        chart.cursor = new am4charts.RadarCursor();
        chart.cursor.fill = am4core.color(this._styles.palette.colorGray);
        chart.tooltip.label.fill = am4core.color(
            this._styles.palette.colorGray
        );
    }

    ngOnDestroy(): void {
        this.zone.runOutsideAngular(() => {
            if (this.ratioChart) {
                this.ratioChart.dispose();
            }
        });
    }
}
