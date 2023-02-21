import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { AuthenticatedResponse } from '../../src/app/api/authenticated-response.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit {
    items: MenuItem[];
    emailid: any;
    private REST_API_SERVER = environment.api_prefix;

    constructor(
        public appMain: AppMainComponent,
        private jwtHelper: JwtHelperService,
        private router: Router,
        private http: HttpClient
    ) {}
    ngOnInit(): void {}
    visibleSidebar2;

    isUserAuthenticated = (): boolean => {
        // debugger;
        const token = localStorage.getItem('jwt');
        this.emailid = JSON.parse(
            window.atob(localStorage.getItem('jwt').split('.')[1])
        )['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];

        // if (token && !this.jwtHelper.isTokenExpired(token)) {
        //     return true;
        // }
        if (token) {
            return true;
        }
        return false;
    };

    // isUserAuthenticated = (): boolean => {
    //     //  debugger;
    //     const token = localStorage.getItem('jwt');
    //     this.emailid = JSON.parse(
    //         window.atob(localStorage.getItem('jwt').split('.')[1])
    //     )['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];

    //     if (token && !this.jwtHelper.isTokenExpired(token)) {
    //         //  console.log('top true');
    //         return true;
    //     }

    //     const isRefreshSuccess = this.tryRefreshingTokens(token);
    //     //  console.log('top2 false');
    //     if (!isRefreshSuccess) {
    //         this.router.navigate(['pages/login']);
    //     }
    //     return false;
    // };

    logOut = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('permission');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['pages/login']);
    };

    // private async tryRefreshingTokens(token: string): Promise<boolean> {
    //     // Try refreshing tokens using refresh token
    //     // debugger;
    //     const refreshToken: string = localStorage.getItem('refreshToken');
    //     if (!token || !refreshToken) {
    //         return false;
    //     }

    //     const credentials = JSON.stringify({
    //         accessToken: token,
    //         refreshToken: refreshToken,
    //     });
    //     let isRefreshSuccess: boolean;

    //     const refreshRes = await new Promise<AuthenticatedResponse>(
    //         (resolve, reject) => {
    //             this.http
    //                 .post<AuthenticatedResponse>(
    //                     this.REST_API_SERVER + 'auth/refresh',
    //                     credentials,
    //                     {
    //                         headers: new HttpHeaders({
    //                             'Content-Type': 'application/json',
    //                         }),
    //                     }
    //                 )
    //                 .subscribe({
    //                     next: (res: AuthenticatedResponse) => resolve(res),
    //                     error: (_) => {
    //                         reject;
    //                         isRefreshSuccess = false;
    //                     },
    //                 });
    //         }
    //     );

    //     localStorage.setItem('jwt', refreshRes.token);
    //     localStorage.setItem('refreshToken', refreshRes.refreshToken);
    //     isRefreshSuccess = true;

    //     return isRefreshSuccess;
    // }
}
