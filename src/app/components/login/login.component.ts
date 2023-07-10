import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatedResponse, LoginModel } from '../../api/login.model';
import { AuthService } from '../../service/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { catchError, concatMap, delay, of, retryWhen, throwError } from 'rxjs';

export const retryCount = 2;
export const retryWaitMilliSeconds = 1000;
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['login.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class LoginComponent implements OnInit {
    invalidLogin: boolean;
    button = 'SUBMIT';
    isLoading = false;
    registerForm: any = FormGroup;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });
        localStorage.removeItem('jwt');
        localStorage.removeItem('permission');
        localStorage.removeItem('refreshToken');
    }

    login() {
        this.isLoading = true;

        this.authService
            .login(this.registerForm.value)
            .pipe(
                retryWhen((error) =>
                    error.pipe(
                        concatMap((error, count) => {
                            if (count <= retryCount) {
                                return of(error);
                            }
                            return throwError(error);
                        }),
                        delay(1000)
                    )
                ),
                catchError((err) => {
                    this.router.navigate(['/pages/access']);
                    this.isLoading = false;
                    this.invalidLogin = true;

                    return throwError(err);
                })
            )
            .subscribe((resp: AuthenticatedResponse) => {
                const token = resp.token;
                const refreshToken = resp.refreshToken;

                localStorage.setItem('jwt', token);
                localStorage.setItem('refreshToken', refreshToken);

                if (token != '') {
                    this.isLoading = false;
                    this.button = 'Submit';
                    this.router.navigate(['/']);
                    this.invalidLogin = false;
                } else {
                    if (
                        resp.msg ==
                        "MSIS9659: Invalid 'username' or 'password'."
                    ) {
                        this.isLoading = false;
                        this.router.navigate(['/pages/error']);
                        this.invalidLogin = true;
                    } else {
                        alert(resp.msg);
                        this.isLoading = false;
                        this.invalidLogin = true;
                    }
                }
            });
    }

    // login = (form: NgForm) => {

    //     this.isLoading = true;
    //     this.button = 'Processing';
    //     this.submitted = true;
    //     if (this.registerForm.invalid) {
    //         return;
    //     }
    //     if (this.submitted) {
    //         this.http
    //             .post<AuthenticatedResponse>(
    //                 this.REST_API_SERVER + 'auth/login',
    //                 this.credentials,
    //                 {
    //                     headers: new HttpHeaders({
    //                         'Content-Type': 'application/json',
    //                     }),
    //                 }
    //             )
    //             .pipe(
    //                 retryWhen((error) =>
    //                     error.pipe(
    //                         concatMap((error, count) => {
    //                             if (count <= retryCount) {
    //                                 return of(error);
    //                             }
    //                             return throwError(error);
    //                         }),
    //                         delay(retryWaitMilliSeconds)
    //                     )
    //                 )
    //             )
    //             .subscribe({
    //                 next: (response: AuthenticatedResponse) => {
    //                     //  debugger;
    //                     const token = response.token;
    //                     const refreshToken = response.refreshToken;
    //                     localStorage.setItem('jwt', response.token);
    //                     localStorage.setItem(
    //                         'refreshToken',
    //                         response.refreshToken
    //                     );
    //                     if (token != '') {
    //                         this.loadUserRoles();
    //                         this.isLoading = false;
    //                         this.button = 'Submit';
    //                         this.router.navigate(['/']);
    //                         this.invalidLogin = false;
    //                     } else {
    //                         if (
    //                             response.msg ==
    //                             "MSIS9659: Invalid 'username' or 'password'."
    //                         ) {
    //                             this.isLoading = false;
    //                             this.router.navigate(['/pages/error']);
    //                             this.invalidLogin = true;
    //                         } else {
    //                             alert(response.msg);
    //                             this.isLoading = false;
    //                             this.invalidLogin = true;
    //                         }
    //                     }
    //                 },
    //                 error: (err: HttpErrorResponse) => {
    //                     //debugger;
    //                     this.router.navigate(['/pages/access']);
    //                     this.isLoading = false;
    //                     this.invalidLogin = true;
    //                 },
    //             });
    //     }
    //     // this.submitButton.nativeElement.disabled = false;
    // };

    loadUserRoles() {
        this.authService.Getrole();
    }
}
