import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthShellComponent } from "./auth-shell/auth-shell.component";
import { LoginComponent } from "./login/login.component";

const routes: Routes = [
    {
        path: "",
        component: AuthShellComponent,
        children: [
            { path: "", redirectTo: "/login", pathMatch: "full" },
            {
                path: "login",
                component: LoginComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {
    static declarations = [LoginComponent, AuthShellComponent];
}
