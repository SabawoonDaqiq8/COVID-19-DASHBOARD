import { Component, OnInit, NgZone, AfterViewInit } from "@angular/core";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { DateMetric } from "../../models/metrics";
import { finalize } from "rxjs/operators";
import { StyleService } from "app/core/services/style.service";
import { CovidService } from "../../services/covid.service";

am4core.useTheme(am4themes_animated);

@Component({
    selector: "fuse-covid19-history-world",
    templateUrl: "./covid19-history-world.component.html",
    styleUrls: ["./covid19-history-world.component.scss"],
})
export class Covid19HistoryWorldComponent implements OnInit {
    private lineChart: am4charts.XYChart;

    dates: any[];
    enableLogaritmiScale: boolean = false;
    currentDate: Date;

    constructor(
        private _covid: CovidService,
        private zone: NgZone,
        private _styles: StyleService
    ) {}

    ngOnInit(): void {
        this._covid
            .getWorldHistory()
            .subscribe((history: any) => this.loadChart(history));
    }

    loadChart(dates: any[]) {
        console.log("Dates => ", dates);
        this.dates = dates;

        this.zone.runOutsideAngular(() => {
            const chart = am4core.create("line-chart", am4charts.XYChart);
            const data = dates.map((date) => {
                return Object.assign({}, date, {
                    date: new Date(date.Date),
                    confirmed: date.TotalConfirmed,
                    recovered: date.TotalRecovered,
                    deaths: date.TotalDeaths,
                });
            });

            data.sort((a, b) => b.date.getTime() - a.date.getTime());
            this.currentDate = data[0].date;

            chart.data = data;

            this.configure(chart);

            this.lineChart = chart;
        });
    }

    configure(chart: am4charts.XYChart) {
        const labelsColor = am4core.color(this._styles.GrayScale.gray500);
        const gridColor = am4core.color(this._styles.GrayScale.gray500);
        const activeColor = am4core.color(this._styles.palette.colorWarning);

        // Create axes

        // Date axis
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 50;
        dateAxis.renderer.labels.template.fill = labelsColor;
        dateAxis.renderer.grid.template.strokeWidth = 0; // no vertical grid line
        dateAxis.renderer.grid.template.stroke = gridColor;
        dateAxis.tooltip.label.fontSize = "0.8em";
        dateAxis.tooltip.background.fill = activeColor;
        dateAxis.tooltip.background.stroke = activeColor;
        dateAxis.max =
            this.currentDate.getTime() + am4core.time.getDuration("day", 5);

        // Value axis
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.interpolationDuration = 3000;
        valueAxis.logarithmic = this.enableLogaritmiScale;
        valueAxis.tooltip.disabled = true;

        valueAxis.renderer.opposite = true;
        valueAxis.renderer.grid.template.stroke = gridColor;
        valueAxis.renderer.minGridDistance = 30;
        valueAxis.renderer.maxLabelPosition = 0.98;

        valueAxis.extraMax = 0.05;
        valueAxis.maxPrecision = 0;
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.verticalCenter = "bottom";
        valueAxis.renderer.labels.template.padding(2, 2, 2, 2);
        valueAxis.renderer.labels.template.fill = labelsColor;

        // Cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.maxTooltipDistance = 0;
        chart.cursor.behavior = "none"; // set zoomX for a zooming possibility
        chart.cursor.lineY.disabled = true;
        chart.cursor.lineX.stroke = activeColor;
        chart.cursor.xAxis = dateAxis;

        // Legend
        chart.legend = new am4charts.Legend();
        chart.legend.parent = chart.plotContainer;
        chart.legend.labels.template.fill = am4core.color(
            this._styles.palette.colorDark
        );
        chart.legend.markers.template.height = 8;
        chart.legend.contentAlign = "left";
        chart.legend.itemContainers.template.valign = "middle";

        // Create series
        this.createSeries(chart, "confirmed", this._styles.palette.colorInfo);
        this.createSeries(
            chart,
            "recovered",
            this._styles.palette.colorSuccess
        );
        this.createSeries(chart, "deaths", this._styles.palette.colorDanger);

        setTimeout(() => {
            this.updateSeriesTooltip(chart, dateAxis);
        }, 3000);
    }

    createSeries(chart: am4charts.XYChart, field: string, color: string) {
        const name = field.charAt(0).toUpperCase() + field.slice(1);
        const seriesColor = am4core.color(color);

        const series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = "date";
        series.name = name;
        series.fill = seriesColor;
        series.stroke = seriesColor;
        series.maskBullets = false;
        series.minBulletDistance = 10;
        series.hidden = field !== "confirmed";
        series.hideTooltipWhileZooming = true;
        //series.strokeWidth = 2;

        // series bullet
        let bullet = series.bullets.push(new am4charts.CircleBullet());

        // Only needed to pass it to circle
        let bulletHoverState = bullet.states.create("hover");
        bullet.setStateOnChildren = true;

        bullet.circle.fillOpacity = 1;
        bullet.circle.fill = am4core.color(this._styles.White);
        bullet.circle.radius = 2;

        let circleHoverState = bullet.circle.states.create("hover");
        circleHoverState.properties.fillOpacity = 1;
        circleHoverState.properties.fill = seriesColor;
        circleHoverState.properties.scale = 1.5;

        // Tooltip setup
        series.tooltip.pointerOrientation = "down";
        series.tooltip.background.fillOpacity = 1;
        series.tooltip.dy = -4;
        series.tooltip.fontSize = "0.8em";
        series.tooltipText = "Total {name}: {valueY}";
    }

    updateSeriesTooltip(
        chart: am4charts.XYChart,
        dateAxis: am4charts.DateAxis
    ) {
        let position = dateAxis.dateToPosition(this.currentDate);
        position = dateAxis.toGlobalPosition(position);

        const x = dateAxis.positionToCoordinate(position);

        chart.cursor.triggerMove({ x: x, y: 0 }, "soft");

        chart.series.each((series) => {
            if (!series.isHidden) {
                series.tooltip.disabled = false;
                series.showTooltipAtDataItem(
                    series.tooltipDataItem as am4charts.XYSeriesDataItem
                );
            }
        });
    }
}
