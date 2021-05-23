import { Component, OnInit, AfterViewInit, Input, NgZone } from "@angular/core";
import { CountryMetric } from "../../models/metrics";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { StyleService } from "app/core/services/style.service";

am4core.useTheme(am4themes_animated);

@Component({
    selector: "fuse-covid19-countries-bars",
    templateUrl: "./covid19-countries-bars.component.html",
    styleUrls: ["./covid19-countries-bars.component.scss"],
})
export class Covid19CountriesBarsComponent implements OnInit, AfterViewInit {
    private barChart: am4charts.XYChart;

    @Input()
    countries: any[];

    @Input()
    world: any;

    @Input()
    top: number = 15;

    constructor(private zone: NgZone, private _styles: StyleService) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        if (this.countries) {
            this.loadChart(this.countries);
        }
    }

    loadChart(metrics: any[]) {
        debugger;
        this.zone.runOutsideAngular(() => {
            let chart = am4core.create("bar-chart", am4charts.XYChart);
            metrics.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);

            chart.data = metrics.slice(0, this.top).map((country) => {
                return {
                    name: country.Country,
                    confirmed: country.TotalConfirmed,
                    percentage:
                        (country.TotalConfirmed / this.world.confirmed.total) *
                        100,
                };
            });

            this.configureChart(chart);

            this.barChart = chart;
        });
    }

    private configureChart(chart: am4charts.XYChart) {
        // Use only absolute numbers
        chart.numberFormatter.numberFormat = "#.#s";

        // Create axes
        const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.grid.template.strokeOpacity = 0;
        categoryAxis.renderer.labels.template.fontSize = 10;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.inversed = true;

        let xAxis = chart.xAxes.push(new am4charts.ValueAxis());
        xAxis.renderer.grid.template.strokeOpacity = 0;

        // Create series
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = "confirmed";
        series.dataFields.categoryY = "name";
        series.columns.template.tooltipText =
            "[bold]{categoryY}[/]\n[font-size:14px][bold]{valueX.percent}%[/] ({valueX})";

        series.columns.template.strokeWidth = 0;
        series.columns.template.fill = am4core.color(
            this._styles.palette.colorPrimary
        );
        series.calculatePercent = true;

        // Label
        let barLabel = series.bullets.push(new am4charts.LabelBullet());
        barLabel.label.text = "{valueX.percent}%";
        barLabel.label.hideOversized = false;
        barLabel.label.truncate = false;
        barLabel.label.horizontalCenter = "left";
        barLabel.label.dx = 10;

        chart.cursor = new am4charts.XYCursor();

        this.barChart = chart;
    }
}
