import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { AgmCoreModule } from "@agm/core";
import { ChartsModule } from "ng2-charts";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatChipsModule } from "@angular/material/chips";

import { FuseWidgetModule } from "@fuse/components/widget/widget.module";
import { FuseSharedModule } from "@fuse/shared.module";
import { CovidDashboardComponent } from "./dashboard/dashboard.component";
import { Covid19CasesByCountryComponent } from "./components/covid19-cases-by-country/covid19-cases-by-country.component";
import { Covid19WorldMapComponent } from "./charts/covid19-world-map/covid19-world-map.component";
import { Covid19PercentageOfCasesComponent } from "./charts/covid19-percentage-of-cases/covid19-percentage-of-cases.component";
import { Covid19CasesWorldwideComponent } from "./components/covid19-cases-worldwide/covid19-cases-worldwide.component";
import { Covid19RecoveryRatioComponent } from "./charts/covid19-recovery-ratio/covid19-recovery-ratio.component";
import { Covid19HistoryWorldComponent } from "./charts/covid19-history-world/covid19-history-world.component";
import { Covid19CountriesBarsComponent } from "./charts/covid19-countries-bars/covid19-countries-bars.component";
import { CovidTableComponent } from "./table/table.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { TranslateModule } from "@ngx-translate/core";

const routes = [
    { path: "", redirectTo: "dashboard", pathMatch: "full" },
    {
        path: "dashboard",
        component: CovidDashboardComponent,
    },
    {
        path: "table",
        component: CovidTableComponent,
    },
];

@NgModule({
    declarations: [
        CovidDashboardComponent,
        Covid19CasesByCountryComponent,
        Covid19WorldMapComponent,
        Covid19PercentageOfCasesComponent,
        Covid19CasesWorldwideComponent,
        Covid19RecoveryRatioComponent,
        Covid19HistoryWorldComponent,
        Covid19CountriesBarsComponent,
        CovidTableComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        MatTableModule,
        MatSidenavModule,
        MatToolbarModule,
        MatCardModule,
        MatListModule,
        MatPaginatorModule,
        MatSortModule,
        TranslateModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8",
        }),
        ChartsModule,
        NgxChartsModule,

        FuseSharedModule,
        FuseWidgetModule,
    ],
})
export class Covid19Module {}
