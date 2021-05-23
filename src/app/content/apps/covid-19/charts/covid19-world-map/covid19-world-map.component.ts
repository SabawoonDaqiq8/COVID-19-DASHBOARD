import {
    Component,
    OnInit,
    Input,
    AfterViewInit,
    NgZone,
    OnChanges,
    SimpleChanges,
} from "@angular/core";
import { CountryMetric } from "../../models/metrics";
import { StyleService } from "app/core/services/style.service";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CovidService } from "./../../services/covid.service";
import { DecimalPipe } from "@angular/common";

am4core.useTheme(am4themes_animated);

@Component({
    selector: "fuse-covid19-world-map",
    templateUrl: "./covid19-world-map.component.html",
    styleUrls: ["./covid19-world-map.component.scss"],
    providers: [DecimalPipe],
})
export class Covid19WorldMapComponent
    implements OnChanges, OnInit, AfterViewInit
{
    private map: am4maps.MapChart;
    private bubbleSeries: am4maps.MapImageSeries;
    private worldSeries: am4maps.MapPolygonSeries;
    private buttons: { [key: string]: am4core.Button } = {};
    private countryLabel: am4core.Label;
    private currentCountry = "World";
    private currentPolygon: am4maps.MapPolygon;
    private max = { confirmed: 0, recovered: 0, deaths: 0, active: 0 };
    private data: any[];
    private cumulative: {};

    @Input()
    selectedCountry: any;

    @Input()
    countries: any[];

    constructor(
        private zone: NgZone,
        private _covid: CovidService,
        private _styles: StyleService,
        private _decimal: DecimalPipe
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.selectedCountry && changes.selectedCountry.currentValue) {
            if (this.selectedCountry.code === "global") {
                this.showWorld();
            } else {
                const selected = this.worldSeries.getPolygonById(
                    this.selectedCountry.CountryCode
                );

                if (selected) {
                    this.selectCountry(selected);
                    this.rollOverCountry(selected);
                }
            }
        }
    }

    ngOnInit(): void {}

    ngAfterViewInit() {
        if (this.countries) {
            this.cumulative = this.countries.reduce(
                (acc, current) => {
                    const confirmed =
                        acc.confirmed + Math.round(current.TotalConfirmed);
                    const recovered =
                        acc.recovered + Math.round(current.TotalRecovered);
                    const deaths = acc.deaths + Math.round(current.TotalDeaths);

                    return {
                        confirmed,
                        recovered,
                        deaths,
                    };
                },
                { confirmed: 0, recovered: 0, deaths: 0 }
            );

            this.loadMap(this.countries);
        }
    }

    updateTotals() {
        this.updateCountryName();

        for (var key in this.buttons) {
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            const total = this._decimal.transform(this.cumulative[key]);

            this.buttons[key].label.text = `${label}:${total}`;
        }
    }

    updateCountryName() {
        this.countryLabel.text = this.currentCountry;
    }

    loadMap(countries: CountryMetric[]) {
        this.zone.runOutsideAngular(() => {
            // Create map instance
            const map = am4core.create("world-map", am4maps.MapChart);
            map.projection = new am4maps.projections.Miller();

            this.configureMap(map, countries);

            this.map.chartContainer.events.on("layoutvalidated", () => {
                this.updateTotals();
            });
        });
    }

    // Maps Events Handlers & Interactions
    handleCountryHit(event: any) {
        this.selectCountry(event.target);
    }

    handleCountryOver(event: any) {
        this.rollOverCountry(event.target);
    }

    handleCountryOut(event: any) {
        this.rollOutCountry(event.target);
    }

    selectCountry(mapPolygon: am4maps.MapPolygon) {
        this.resetHover();
        this.worldSeries.hideTooltip();

        // if the same country is clicked show world
        if (this.currentPolygon == mapPolygon) {
            this.currentPolygon.isActive = false;
            this.currentPolygon = undefined;
            this.showWorld();
            return;
        }
        // save current polygon
        this.currentPolygon = mapPolygon;
        //var countryIndex = countryIndexMap[mapPolygon.dataItem.id];
        this.currentCountry = (mapPolygon.dataItem.dataContext as any).name;

        // make others inactive
        this.worldSeries.mapPolygons.each(function (polygon) {
            polygon.isActive = false;
        });

        // clear timeout if there is one
        /* if (countryDataTimeout) {
      clearTimeout(countryDataTimeout);
    } */

        // we delay change of data for better performance (so that data is not changed whil zooming)
        /*countryDataTimeout = setTimeout(function() {
      this.updateTotals(countryIndex);
    }, 1000);*/

        //this.updateTotals(); //currentIndex
        this.updateCountryName();

        mapPolygon.isActive = true;
        this.map.zoomToMapObject(mapPolygon, this.getZoomLevel(mapPolygon));
    }

    rollOverCountry(mapPolygon: am4maps.MapPolygon) {
        this.resetHover();

        if (mapPolygon) {
            mapPolygon.isHover = true;

            // make bubble hovered too
            const image = this.bubbleSeries.getImageById(
                mapPolygon.dataItem.id
            );

            if (image) {
                (<any>image.dataItem.dataContext).name = (<any>(
                    mapPolygon.dataItem.dataContext
                )).name;
                image.isHover = true;
            }
        }
    }

    rollOutCountry(mapPolygon: am4maps.MapPolygon) {
        this.resetHover();

        const image = this.bubbleSeries.getImageById(mapPolygon.dataItem.id);

        if (image) {
            image.isHover = false;
        }
    }

    getZoomLevel(mapPolygon: am4maps.MapPolygon) {
        const w = mapPolygon.polygon.bbox.width;
        const h = mapPolygon.polygon.bbox.width;

        // change 2 to smaller walue for a more close zoom
        return Math.min(
            this.map.seriesWidth / (w * 2),
            this.map.seriesHeight / (h * 2)
        );
    }

    showWorld() {
        this.currentCountry = "World";
        this.currentPolygon = undefined;
        this.resetHover();

        /*if (countryDataTimeout) {
      clearTimeout(countryDataTimeout);
    }*/

        // make all inactive
        this.worldSeries.mapPolygons.each(function (polygon) {
            polygon.isActive = false;
        });

        this.updateCountryName();
        //this.updateTotals(); // currentIndex
        this.map.goHome();
    }

    resetHover() {
        this.worldSeries.mapPolygons.each((polygon) => {
            polygon.isHover = false;
        });

        this.bubbleSeries.mapImages.each((image) => {
            image.isHover = false;
        });
    }

    configureMap(map: am4maps.MapChart, countries: any[]) {
        // Remove countries without confirmed cases (0) for better performance
        const hasConfirmed = countries.filter(
            (country: any) => country.TotalConfirmed > 0
        );

        const data = hasConfirmed.map((country: any) => {
            return {
                id: country.CountryCode,
                name: country.Country,
                confirmed: country.TotalConfirmed,
                recovered: country.TotalRecovered,
                deaths: country.TotalDeaths,
            };
        });

        this.data = data;

        // the last day will have most
        data.forEach((di) => {
            if (di.confirmed > this.max.confirmed) {
                this.max.confirmed = di.confirmed;
            }

            if (di.recovered > this.max.recovered) {
                this.max.recovered = di.recovered;
            }

            if (di.deaths > this.max.deaths) {
                this.max.deaths = di.deaths;
            }

            this.max.active = this.max.confirmed;
        });

        // Create polygon series for world map
        let worldSeries = map.series.push(new am4maps.MapPolygonSeries());
        worldSeries.useGeodata = true;
        worldSeries.dataFields.id = "id";
        worldSeries.dataFields.value = "confirmed";
        worldSeries.interpolationDuration = 0;
        worldSeries.exclude = ["AQ"];
        worldSeries.nonScalingStroke = true;
        worldSeries.strokeWidth = 0.5;
        worldSeries.calculateVisualCenter = true;
        worldSeries.data = data;
        this.worldSeries = worldSeries;

        // Configure how the countries will look like
        let worldPolygon = worldSeries.mapPolygons.template;
        worldPolygon.fill = am4core.color(this._styles.White);
        worldPolygon.fillOpacity = 1;
        worldPolygon.stroke = am4core.color(this._styles.GrayScale.gray200);
        worldPolygon.strokeOpacity = 1;
        worldPolygon.setStateOnChildren = true;
        worldPolygon.tooltipPosition = "fixed";

        worldPolygon.events.on("hit", (e) =>
            this.handleCountryHit.call(this, e)
        );
        worldPolygon.events.on("over", (e) =>
            this.handleCountryOver.call(this, e)
        );
        worldPolygon.events.on("out", (e) =>
            this.handleCountryOut.call(this, e)
        );

        worldSeries.heatRules.push({
            target: worldPolygon,
            property: "fill",
            min: am4core.color(this._styles.White),
            max: am4core.color(this._styles.White),
            dataField: "value",
        });

        worldPolygon.tooltipText = "";
        worldPolygon.nonScalingStroke = true;
        worldPolygon.strokeOpacity = 0.5;

        // polygon states
        const polygonHoverState = worldPolygon.states.create("hover");
        polygonHoverState.transitionDuration = 1400;
        polygonHoverState.properties.fill = am4core.color(
            this._styles.GrayScale.gray300
        );

        const polygonActiveState = worldPolygon.states.create("active");
        polygonActiveState.properties.fill = am4core.color(
            this._styles.GrayScale.gray400
        );

        this.addBubbles(map, data, worldSeries);
        this.addButtons(map);

        // Set map definition
        map.geodata = am4geodata_worldLow;
        map.zoomControl = new am4maps.ZoomControl();

        // Save the map instance
        this.map = map;
    }

    addBubbles(
        map: am4maps.MapChart,
        data: any[],
        worldSeries: am4maps.MapPolygonSeries
    ) {
        const name = "confirmed";

        // Bubble series
        const bubbleSeries = map.series.push(new am4maps.MapImageSeries());
        bubbleSeries.data = data;
        bubbleSeries.dataFields.value = name;
        bubbleSeries.dataFields.id = "id";
        this.bubbleSeries = bubbleSeries;

        // Adjust tooltip
        bubbleSeries.tooltip.animationDuration = 0;
        bubbleSeries.tooltip.showInViewport = false;
        //bubbleSeries.tooltip.background.fillOpacity = 0.2;
        //bubbleSeries.tooltip.getStrokeFromObject = true;
        //bubbleSeries.tooltip.getFillFromObject = false;
        //bubbleSeries.tooltip.background.fillOpacity = 0.2;
        //bubbleSeries.tooltip.background.fill = am4core.color('#f00');

        // Add a circle to the countries
        const imageTemplate = bubbleSeries.mapImages.template;
        // if you want bubbles to become bigger when zoomed, set this to false
        imageTemplate.nonScaling = true;
        imageTemplate.strokeOpacity = 0;
        imageTemplate.fillOpacity = 0.55;
        imageTemplate.tooltipText = "{name}: [bold]{value}[/]";
        imageTemplate.applyOnClones = true;

        //imageTemplate.events.on("over", handleImageOver);
        //imageTemplate.events.on("out", handleImageOut);
        //imageTemplate.events.on("hit", handleImageHit);

        // Point the tooltip at the top of the circle instead of the middle
        imageTemplate.adapter.add("tooltipY", (tooltipY: any, target: any) => {
            return -target.children.getIndex(0).radius;
        });

        // Add circle inside the image
        const circle = imageTemplate.createChild(am4core.Circle);
        // this makes the circle to pulsate a bit when showing it
        circle.hiddenState.properties.scale = 0.0001;
        circle.hiddenState.transitionDuration = 2000;
        circle.defaultState.transitionDuration = 2000;
        circle.defaultState.transitionEasing = am4core.ease.elasticOut;
        circle.fill = am4core.color(this._covid.getCaseStyleColor(name));

        // later we set fill color on template (when changing what type of data the map should show) and all the clones get the color because of this
        circle.applyOnClones = true;

        // heat rule makes the bubbles to be of a different width. Adjust min/max for smaller/bigger radius of a bubble
        bubbleSeries.heatRules.push({
            target: circle,
            property: "radius",
            min: 3,
            max: 40,
            dataField: "value",
        });

        // when data items validated, hide 0 value bubbles (because min size is set)
        bubbleSeries.events.on("dataitemsvalidated", function () {
            bubbleSeries.dataItems.each((dataItem) => {
                const mapImage = dataItem.mapImage;
                const circle = mapImage.children.getIndex(0);

                if (mapImage.dataItem.value == 0) {
                    circle.hide(0);
                } else if (circle.isHidden || circle.isHiding) {
                    circle.show();
                }
            });
        });

        // this places bubbles at the visual center of a country
        imageTemplate.adapter.add("latitude", function (latitude, target) {
            const polygon = worldSeries.getPolygonById(target.dataItem.id);

            if (polygon) {
                target.disabled = false;
                return polygon.visualLatitude;
            } else {
                target.disabled = true;
            }

            return latitude;
        });

        imageTemplate.adapter.add("longitude", function (longitude, target) {
            const polygon = worldSeries.getPolygonById(target.dataItem.id);

            if (polygon) {
                target.disabled = false;
                return polygon.visualLongitude;
            } else {
                target.disabled = true;
            }
            return longitude;
        });
    }

    addButtons(map: am4maps.MapChart) {
        // country name and buttons container
        const nameAndButtonsContainer = map.chartContainer.createChild(
            am4core.Container
        );
        nameAndButtonsContainer.width = am4core.percent(100);
        nameAndButtonsContainer.padding(0, 10, 5, 20);
        nameAndButtonsContainer.layout = "horizontal";
        nameAndButtonsContainer.valign = "top";

        // name of a country and date label
        this.countryLabel = nameAndButtonsContainer.createChild(am4core.Label);
        this.countryLabel.fontSize = "1.1em";
        this.countryLabel.fill = am4core.color("#f00");
        this.countryLabel.valign = "middle";

        // buttons container (active/confirmed/recovered/deaths)
        const buttonsContainer = nameAndButtonsContainer.createChild(
            am4core.Container
        );
        buttonsContainer.layout = "grid";
        buttonsContainer.width = am4core.percent(100);
        buttonsContainer.x = 10;
        buttonsContainer.contentAlign = "right";

        // create buttons
        //this.addButton(buttonsContainer, 'active');
        this.addButton(buttonsContainer, "confirmed");
        this.addButton(buttonsContainer, "recovered");
        this.addButton(buttonsContainer, "deaths");
    }

    addButton(buttonsContainer: am4core.Container, name: string) {
        const color = am4core.color(this._covid.getCaseStyleColor(name));
        const button = buttonsContainer.createChild(am4core.Button);

        button.label.valign = "middle";
        button.label.fill = color;
        button.label.fontSize = ".75rem";
        button.background.cornerRadius(30, 30, 30, 30);
        button.background.strokeOpacity = 0.3;
        button.background.fillOpacity = 0;
        button.background.stroke = color;
        button.background.padding(2, 3, 2, 3);
        button.states.create("active");
        button.setStateOnChildren = true;

        const activeHoverState = button.background.states.create("hoverActive");
        activeHoverState.properties.fillOpacity = 0;

        const circle = new am4core.Circle();
        circle.radius = 8;
        circle.fillOpacity = 0.3;
        circle.fill = color;
        circle.strokeOpacity = 0;
        circle.valign = "middle";
        circle.marginRight = 5;
        button.icon = circle;

        // save name to dummy data for later use
        button.dummyData = name;

        const circleActiveState = circle.states.create("active");
        circleActiveState.properties.fill = am4core.color(color);
        circleActiveState.properties.fillOpacity = 0.5;

        //TODO: Update the map values on button click
        //button.events.on('hit', e => this.handleButtonClick.call(this, e));

        this.buttons[name] = button;
    }

    // handle button clikc
    handleButtonClick(event: any) {
        console.log(event);
        this.changeDataType(event.target.dummyData);
    }

    // change data type (active/confirmed/recovered/deaths)
    changeDataType(name: string) {
        const buttons = this.buttons;
        const currentType = name;
        const color = am4core.color(this._covid.getCaseStyleColor(name));

        let currentTypeName = name;

        if (name != "deaths") {
            currentTypeName += " cases";
        }

        this.bubbleSeries.mapImages.template.tooltipText =
            "[bold]{name}: {value}[/] [font-size:10px]\n" + currentTypeName;

        // make button active
        const activeButton = buttons[name];
        activeButton.isActive = true;

        // make other buttons inactive
        Object.keys(buttons).forEach((key) => {
            if (buttons[key] != activeButton) {
                buttons[key].isActive = false;
            }
        });

        // tell series new field name
        this.bubbleSeries.dataFields.value = name;
        this.worldSeries.dataFields.value = name;

        this.bubbleSeries.dataItems.each((dataItem) => {
            dataItem.setValue("value", dataItem.dataContext[currentType]);
        });

        this.worldSeries.dataItems.each((dataItem) => {
            dataItem.setValue("value", dataItem.dataContext[currentType]);
            dataItem.mapPolygon.defaultState.properties.fill = undefined;
        });

        // change color of bubbles
        // setting colors on mapImage for tooltip colors
        this.bubbleSeries.mapImages.template.fill = color;
        this.bubbleSeries.mapImages.template.stroke = color;

        // first child is circle
        this.bubbleSeries.mapImages.template.children.getIndex(0).fill = color;

        // update heat rule's maxValue
        this.bubbleSeries.heatRules.getIndex(0).maxValue =
            this.max[currentType];
        this.worldSeries.heatRules.getIndex(0).maxValue = this.max[currentType];
    }
}
