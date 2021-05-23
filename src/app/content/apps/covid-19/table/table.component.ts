import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { CovidService } from "../services/covid.service";

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
    selector: "covid-table",
    templateUrl: "./table.component.html",
    styleUrls: ["./table.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CovidTableComponent implements OnInit {
    displayedColumns: string[] = [
        "id",
        "name",
        "active",
        "confirmed",
        "recovered",
        "deaths",
        "lastUpdated",
    ];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    countries: any;

    constructor(private _covid: CovidService) {}

    ngOnInit() {
        this.getCountriesForTable();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    getCountriesForTable() {
        debugger;
        this._covid.getCountryMetrics().subscribe((metrics: any) => {
            this.countries = metrics.Countries;
            this.countries.sort((a, b) => b.NewConfirmed - a.NewConfirmed);
            let number = 1;
            this.countries = this.countries.map((country: any) => {
                return {
                    number: number++,
                    name: country.Country,
                    active:
                        country.TotalConfirmed -
                        (country.TotalRecovered + country.TotalDeaths),
                    confirmed: country.TotalConfirmed,
                    recovered: country.TotalRecovered,
                    deaths: country.TotalDeaths,
                    lastUpdated: country.Date,
                };
            });
            this.dataSource = new MatTableDataSource(this.countries);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }
}
