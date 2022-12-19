import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticatedResponse } from '../api/authenticated-response.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private jwtHelper: JwtHelperService,
        private http: HttpClient
    ) {}
    private REST_API_SERVER = environment.api_prefix;

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        const token = localStorage.getItem('jwt');
        //  debugger;
        // if (token && !this.jwtHelper.isTokenExpired(token)) {
        //     //  console.log(this.jwtHelper.decodeToken(token))
        //     // console.log('authugard true');
        //     return true;
        // }
        // //   console.log('authguard false');
        // this.router.navigate(['pages/login']);
        // return true;

        if (token && !this.jwtHelper.isTokenExpired(token)) {
            //   console.log(this.jwtHelper.decodeToken(token));
            return true;
        }

        const isRefreshSuccess = await this.tryRefreshingTokens(token);
        if (!isRefreshSuccess) {
            this.router.navigate(['pages/login']);
        }

        return isRefreshSuccess;
    }

    private async tryRefreshingTokens(token: string): Promise<boolean> {
        // Try refreshing tokens using refresh token
        //  debugger;
        const refreshToken: string = localStorage.getItem('refreshToken');
        if (!token || !refreshToken) {
            return false;
        }

        const credentials = JSON.stringify({
            accessToken: token,
            refreshToken: refreshToken,
        });
        let isRefreshSuccess: boolean;

        const refreshRes = await new Promise<AuthenticatedResponse>(
            (resolve, reject) => {
                this.http
                    .post<AuthenticatedResponse>(
                        this.REST_API_SERVER + 'auth/refresh',
                        credentials,
                        {
                            headers: new HttpHeaders({
                                'Content-Type': 'application/json',
                            }),
                        }
                    )
                    .subscribe({
                        next: (res: AuthenticatedResponse) => resolve(res),
                        error: (_) => {
                            reject;
                            isRefreshSuccess = false;
                        },
                    });
            }
        );

        localStorage.setItem('jwt', refreshRes.token);
        localStorage.setItem('refreshToken', refreshRes.refreshToken);
        isRefreshSuccess = true;

        return isRefreshSuccess;
    }
}
