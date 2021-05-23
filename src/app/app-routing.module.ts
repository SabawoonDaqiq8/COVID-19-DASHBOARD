import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { Shell } from "app/shell/shell.service";
const routes: Routes = [
    Shell.childRoutes([
        {
            path: "covid-19",
            loadChildren: () =>
                import("./content/apps/covid-19/covid19.module").then(
                    (m) => m.Covid19Module
                ),
        },
    ]),
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules,
            scrollPositionRestoration: "enabled",
        }),
    ],
    exports: [RouterModule],
    providers: [],
})
export class AppRoutingModule {}
