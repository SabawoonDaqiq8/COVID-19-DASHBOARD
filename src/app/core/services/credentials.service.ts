import { Injectable } from "@angular/core";

const credentialsKey = "credentials";

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
    providedIn: "root",
})
export class CredentialsService {
    private _credentials: any | null = null;

    constructor() {
        const savedCredentials = localStorage.getItem(credentialsKey);
        if (savedCredentials) {
            this._credentials = JSON.parse(savedCredentials);
        }
    }

    /**
     * Checks is the user is authenticated.
     * @return True if the user is authenticated.
     */
    isAuthenticated(): boolean {
        return !!this.credentials;
    }

    /**
     * Gets the user credentials.
     * @return The user credentials or null if the user is not authenticated.
     */
    get credentials(): any | null {
        return this._credentials;
    }
    get avatar(): string {
        return this._credentials.avatar;
    }
    get fullName(): string {
        return `${this._credentials.firstName} ${this._credentials.lastName}`;
    }
    get email(): string {
        return this._credentials.email;
    }
    /**
     * Sets the user credentials.
     * The credentials may be persisted across sessions by setting the `remember` parameter to true.
     * Otherwise, the credentials are only persisted for the current session.
     * @param credentials The user credentials.
     * @param remember True to remember credentials across sessions.
     */
    setCredentials(authorizationEntity?: any, remember?: boolean) {
        if (authorizationEntity) {
            // const storage = remember ? localStorage : sessionStorage;
            const storage = localStorage;

            storage.setItem(
                credentialsKey,
                JSON.stringify(authorizationEntity)
            );
            this._credentials = authorizationEntity;
        } else {
            this._credentials = null;
            localStorage.removeItem(credentialsKey);
        }
    }
}
