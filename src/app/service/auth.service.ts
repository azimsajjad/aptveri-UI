import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../api/login.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private REST_API_SERVER = environment.api_prefix;
    userData = new BehaviorSubject<User>(new User());
    private _userRole: Array<any> = [];
    private _userpermission: Array<any> = [];
    private userpermission: any;
    constructor(private http: HttpClient, private router: Router) {}

    login(userDetails) {
        return this.http
            .post<any>(`${this.REST_API_SERVER}auth/login`, userDetails)
            .pipe(
                map((response) => {
                    localStorage.setItem('jwt', response.token);
                    localStorage.setItem('refreshToken', response.refreshToken);

                    this.setUserDetails();
                    return response;
                })
            );
    }

    setUserDetails() {
        //  debugger;
        if (localStorage.getItem('jwt')) {
            const userDetails = new User();
            // const decodeUserDetails = JSON.parse(window.atob(localStorage.getItem('jwt').split('.')[1]));

            // userDetails.userName = decodeUserDetails['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
            // userDetails.firstName = decodeUserDetails.GivenName;
            // userDetails.isLoggedIn = true;
            // userDetails.role = decodeUserDetails.Role;

            //this.userData.next(userDetails);
            //  console.log(this.userData);
        }
    }

    logout() {
        localStorage.removeItem('jwt');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('permission');
        this.router.navigate(['pages/login']);
        this.userData.next(new User());
    }

    public GetroleRequest() {
        return this.http.get(`${this.REST_API_SERVER}Profile/Menu`);
    }

    Getrole() {
        //debugger;
        // return this.http.get<any>('https://localhost:7204/api/Profile/Menu')
        //   .pipe(map(response => {
        //     console.log(response);
        //     this.userpermission =response;
        //     console.log(this.userpermission);
        //     return response;
        //   }));

        this.http.get<any>(`${this.REST_API_SERVER}Profile/Menu`).subscribe({
            next: (data) => {
                //   console.log(data);
                this._userRole = data.data[0];

                localStorage.setItem(
                    'permission',
                    JSON.stringify(data.data[0].menuModules)
                );
                // this.checkPermission();
                //  console.log(this._userRole);
            },
            error: (error) => {
                // this.errorMessage = error.message;
                console.error('There was an error!', error);
            },
        });
    }

    //moduleid:any, screenid:any, permission:any
    checkPermission(moduleid: any, screenid: any, permission: any) {
        //fliter module
        //  debugger;
        this._userRole = JSON.parse(localStorage.getItem('permission'));
        const resultmenu = this._userRole.filter((obj) => {
            return obj.module_id === moduleid;
        });
        // fliter screen
        this._userpermission = resultmenu.map((a) => a.screenMenu);
        const sweeterArray = this._userpermission[0].filter((sweetItem) => {
            return sweetItem.screen_id === screenid;
        });
        const resultpermission = sweeterArray.map((a) => a.permissionDetails);
        // fliter permission
        //    let resultArray=resultpermission[0].filter(function(item) {
        //     return item["permission_name"] === 'A';
        //     });

        const found = resultpermission[0].find((obj) => {
            return obj.permission_name === permission;
        });

        if (found !== undefined) {
            //  console.log(true);
            return true;
        } else {
            //  console.log(false);

            return false;
        }
    }
}
