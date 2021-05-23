import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { FuseSharedModule } from "@fuse/shared.module";
import { AuthRoutingModule } from "../auth/auth-routing.module";

@NgModule({
    declarations: [AuthRoutingModule.declarations],
    imports: [
        AuthRoutingModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatIconModule,
        MatInputModule,

        FuseSharedModule,
    ],
})
export class AuthModule {}
