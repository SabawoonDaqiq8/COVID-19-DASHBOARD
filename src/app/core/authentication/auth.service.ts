import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiService } from "./../api/api.service";
import { CredentialsService } from "../services/credentials.service";
import { HttpClient } from "@angular/common/http";

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
const routes = {
    login: () => `/api/users`,
    logout: () => `/users/logout`,
};

@Injectable({
    providedIn: "root",
})
export class AuthenticationService {
    private loggedIn: boolean;

    get isAuthenticated() {
        return this.loggedIn;
    }

    constructor(
        private _credentials: CredentialsService,
        private _api: ApiService,
        private http: HttpClient
    ) {}

    /**
     * Authenticates the user.
     * @param context The login parameters.
     * @return The user credentials.
     */
    login(context: any): Observable<any> {
        console.log("email ==>", context);
        this.loggedIn = true;
        const data: any = this._api.get<any>(routes.login());

        return data;
    }

    /**
     * Logs out the user and clear credentials.
     * @return True if the user was logged out successfully.
     */
    logout() {
        // Customize credentials invalidation here
        this._credentials.setCredentials();
    }
}
