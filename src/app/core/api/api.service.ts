import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { CredentialsService } from "app/core/services/credentials.service";

@Injectable({
    providedIn: "root",
})
export class ApiService {
    constructor(
        private _credentials: CredentialsService,
        private http: HttpClient
    ) {}

    public get<T>(route: string, itemType?: any): Observable<T> {
        if (!route) {
            return;
        }
        return (
            this.http
                // .cache()
                .get<T>(route)
                .pipe(
                    map((data: T) => {
                        return data;
                    })
                )
        );
    }

    public post<T>(route: string, data: any): Observable<T> {
        if (!route) {
            return;
        }
        return this.http.post<T>(`${route}`, data);
    }
    public postWithToken<T>(route: string, data: any): Observable<T> {
        if (!route) {
            return;
        }
    }

    public removeTokenAndLogOut<T>(route: any, data: any): Observable<T> {
        if (!route) {
            return;
        }
        return this.http.delete<T>(`${route}/${data.access_token}/${data.id}`);
    }
}
