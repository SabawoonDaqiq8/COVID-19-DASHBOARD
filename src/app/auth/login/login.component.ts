import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { ActivatedRoute, Params } from "@angular/router";
import { AuthenticationService } from "app/core/authentication/auth.service";
import { CredentialsService } from "app/core/services/credentials.service";
import { RedirectService } from "app/core/services/redirect.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as _ from "lodash";

@Component({
    selector: "login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    error: any;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private route: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private _authentication: AuthenticationService,
        private _credentials: CredentialsService,
        private _redirect: RedirectService,
        private _formBuilder: FormBuilder
    ) {
        if (this._credentials.isAuthenticated()) {
            console.log(this._credentials.isAuthenticated());
            this._redirect.toCovid;
        }
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true,
                },
                toolbar: {
                    hidden: true,
                },
                footer: {
                    hidden: true,
                },
                sidepanel: {
                    hidden: true,
                },
            },
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.createForm();
    }

    createForm() {
        this.loginForm = this._formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", Validators.required],
        });
    }
    login(form: any) {
        console.log(form);
        this._authentication.login(form.value).subscribe(
            (credentials: any) => {
                let user: any = _.find(credentials, {
                    email: form.value.email,
                    password: form.value.password,
                });
                if (user) {
                    console.debug(
                        `${credentials.firstName} successfully logged in`
                    );
                    this._credentials.setCredentials(user);
                    this.route.queryParams.subscribe((params) =>
                        this.redirect(params)
                    );
                } else {
                    this._snackBar.open(
                        "Incorrect email or password!",
                        "close",
                        {
                            duration: 2000,
                            horizontalPosition: "right",
                            verticalPosition: "top",
                        }
                    );
                }
            },
            (error) => {
                console.debug(`Login error: ${error}`);
                this.error = error.error;
            }
        );
    }

    redirect(params: Params) {
        if (params.redirect) {
            this._redirect.to(params.redirect, { replaceUrl: true });
        } else {
            this._redirect.toCovid();
        }
    }
}
