import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { AuthenticatedResponse } from '../../api/authenticated-response.model';
import { LoginModel } from '../../api/login.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { first } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import {
    FormControl,
    FormGroup,
    Validators,
    FormBuilder,
    FormsModule,
} from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, delay, retryWhen } from 'rxjs/operators';

export const retryCount = 2;
export const retryWaitMilliSeconds = 1000;
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    providers: [MessageService, ConfirmationService],
    styles: [
        `
            :host ::ng-deep .pi-eye {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
            :host ::ng-deep .p-header {
                background: red;
            }
            .mycontainer1 {
                // background-image: url('../../../assets/layout/images/MIA_Home.gif');
                height: 100vh;
                background-position: left top;
                background-size: cover;
                background-repeat: no-repeat;
            }
            .mycontainer {
                height: 100vh;
                position: fixed;
            }
            .login-page {
                width: 350px;
                padding: 4% 0% 0% 0%;
                margin: auto;
                float: right;
                margin-right: 2%;
            }
            .login-page .form .login {
                margin-top: -1px;
            }
            .form {
                position: relative;
                z-index: 1;
                background: #ffffff;
                max-width: 350px;
                margin: 0 auto 100px;
                padding: 8px;
                text-align: center;
                box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2),
                    0 5px 5px 0 rgba(0, 0, 0, 0.24);
            }
            .form input {
                font-family: bogle, sans-serif;
                outline: 0;
                background: #f2f2f2;
                width: 90%;
                border: 0;
                margin: 0 0 15px;
                padding: 8px;
                box-sizing: border-box;
                font-size: 0.8125rem;
            }
            .form button {
                font-family: bogle, sans-serif;
                text-transform: uppercase;
                outline: 0;
                background-color: #02066b;
                background-image: linear-gradient(45deg, #328f8a, #02066b);
                width: 90%;
                border: 0;
                padding: 8px;
                color: #ffffff;
                font-size: 0.8125rem;
                -webkit-transition: all 0.3 ease;
                transition: all 0.3 ease;
                cursor: pointer;
            }
            .form .message {
                margin: 15px 0 0;
                color: #b3b3b3;
                font-size: 0.8125rem;
            }
            .form .message a {
                color: #4caf50;
                text-decoration: none;
            }

            .container {
                position: relative;
                z-index: 1;
                max-width: 200px;
                margin: 0 auto;
            }

            body {
                background-color: #328f8a;
                background-image: linear-gradient(45deg, #328f8a, #08ac4b);
                font-family: bogle, sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            @font-face {
                font-family: 'Bogle';
                font-style: normal;
                font-weight: 400;
                src: local(''),
                    url('../../../assets/theme/lara-light-blue/fonts/BogleWeb-Regular.woff')
                        format('woff');
                font-display: block;
                /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
            }

            #header_container {
                background: #ffffff;
                border: 1px solid #666;
                height: 80px;
                left: 0;
                position: fixed;
                width: 100%;
                top: 0;
                border-left: 4px solid #0071cd !important;
                border-top: 4px solid #ffc220 !important;
                // left: 0.3em;
            }
            .form-inline {
                display: flex;
                flex-flow: row wrap;
                align-items: center;
                position: absolute;
                right: 1%;
            }

            .form-inline label {
                margin: 5px 10px 5px 0;
            }

            .form-inline input {
                vertical-align: middle;
                margin: 5px 10px 5px 0;
                padding: 10px;
                background-color: #fff;
                border: 1px solid #ddd;
            }

            .form-inline button {
                padding: 10px 20px;
                background-color: dodgerblue;
                border: 1px solid #ddd;
                color: white;
                cursor: pointer;
            }

            .form-inline button:hover {
                background-color: royalblue;
            }

            @media (max-width: 800px) {
                .form-inline input {
                    margin: 10px 0;
                }

                .form-inline {
                    flex-direction: column;
                    align-items: stretch;
                }
            }
            #header {
                line-height: 60px;
                margin: 10 auto;
                width: 940px;
                text-align: left;
                font-size: 26px;
                color: #f5f5f5;
                line-height: 28px;
                margin-bottom: 14px;
                font-family: bogle, sans-serif;
            }

            /* CSS for the content of page. I am giving top and bottom
   padding of 80px to make sure the header and footer
   do not overlap the content. */
            #container {
                margin: 0 auto;
                overflow: auto;
                padding: 80px 0;
                width: 940px;
            }

            #content {
            }

            /* Make Footer Sticky */
            #footer_container {
                background: #eee;
                border: 1px solid #666;
                bottom: 0;
                height: 60px;
                left: 0;
                position: fixed;
                width: 100%;
            }

            #footer {
                line-height: 60px;
                margin: 0 auto;
                width: 940px;
                text-align: center;
            }
            :host ::ng-deep .p-password input {
                width: 11rem;
            }

            .showcase {
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                color: #fff;
                padding: 0 20px;
            }

            .video-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            .video-container video {
                min-width: 100%;
                min-height: 100%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                object-fit: cover;
            }

            .video-container:after {
                content: '';
                z-index: 1;
                height: 100%;
                width: 100%;
                top: 0;
                left: 0;
                position: absolute;
            }

            .content {
                z-index: 2;
            }
        `,
    ],
})
export class LoginComponent implements OnInit {
    invalidLogin: boolean;
    button = 'Submit';
    isLoading = false;
    credentials: LoginModel = { username: '', password: '' };
    private REST_API_SERVER = environment.api_prefix;
    registerForm: any = FormGroup;
    submitted = false;
    @ViewChild('submitButton') submitButton: ElementRef;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
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

    get f() {
        return this.registerForm.controls;
    }
    onSubmit() {
        this.submitted = true;
        //  this.isLoading = true;
        //  this.button = 'Processing';
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            // return;
        }
        //True if all the fields are filled
        if (this.submitted) {
            alert('Great!!');
        }
    }

    login = (form: NgForm) => {
        // this.submitButton.nativeElement.disabled = true;

        this.isLoading = true;
        this.button = 'Processing';
        //  debugger;
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }
        if (this.submitted) {
            // this.http.post<AuthenticatedResponse>("https://localhost:7204/api/auth/login", this.credentials, {
            //   headers: new HttpHeaders({ "Content-Type": "application/json"})
            // })
            // .subscribe({
            //   next: (response: AuthenticatedResponse) => {
            //     const token = response.token;
            //     localStorage.setItem("jwt", token);
            //     this.invalidLogin = false;
            //     this.router.navigate(["/"]);
            //   },
            //   error: (err: HttpErrorResponse) => this.invalidLogin = true
            // })
            //   const returnUrl = this.router.snapshot.queryParamMap.get('returnUrl') || '/';
            // this.authService
            //     .login(this.credentials)
            //     .pipe(first())
            //     .subscribe(
            //         () => {
            //             this.loadUserRoles();
            //             this.invalidLogin = false;
            //             this.router.navigate(['/']);
            //             //   console.log('login1 false');
            //         },
            //         () => {
            //             //  debugger;
            //             //this.messageService.add({severity: 'error', summary: 'Invalid User', detail: 'Validation failed', life: 9000});
            //             this.router.navigate(['/pages/access']);
            //             this.invalidLogin = true;
            //             //      console.log('login 2 true');
            //             //  this.loading = false;
            //             // this.loginForm.reset();
            //             // this.loginForm.setErrors({
            //             //   invalidLogin: true
            //             // });
            //         }
            //     );

            // this.http
            //     .post<AuthenticatedResponse>(
            //         this.REST_API_SERVER + 'auth/login',
            //         this.credentials,
            //         {
            //             headers: new HttpHeaders({
            //                 'Content-Type': 'application/json',
            //             }),
            //         }
            //     )
            //     .subscribe({
            //         next: (response: AuthenticatedResponse) => {
            //             // debugger;
            //             const token = response.token;
            //             const refreshToken = response.refreshToken;
            //             localStorage.setItem('jwt', response.token);
            //             localStorage.setItem(
            //                 'refreshToken',
            //                 response.refreshToken
            //             );
            //             if (token != '') {
            //                 this.loadUserRoles();
            //                 this.isLoading = false;
            //                 this.button = 'Submit';
            //                 this.router.navigate(['/']);
            //                 this.invalidLogin = false;
            //             } else {
            //                 alert(response.msg);
            //             }
            //         },
            //         error: (err: HttpErrorResponse) => {
            //             //debugger;
            //             this.router.navigate(['/pages/access']);
            //             this.invalidLogin = true;
            //         },
            //     });
            // debugger;
            this.http
                .post<AuthenticatedResponse>(
                    this.REST_API_SERVER + 'auth/login',
                    this.credentials,
                    {
                        headers: new HttpHeaders({
                            'Content-Type': 'application/json',
                        }),
                    }
                )
                .pipe(
                    retryWhen((error) =>
                        error.pipe(
                            concatMap((error, count) => {
                                if (count <= retryCount) {
                                    return of(error);
                                }
                                return throwError(error);
                            }),
                            delay(retryWaitMilliSeconds)
                        )
                    )
                )
                .subscribe({
                    next: (response: AuthenticatedResponse) => {
                        //  debugger;
                        const token = response.token;
                        const refreshToken = response.refreshToken;
                        localStorage.setItem('jwt', response.token);
                        localStorage.setItem(
                            'refreshToken',
                            response.refreshToken
                        );
                        if (token != '') {
                            this.loadUserRoles();
                            this.isLoading = false;
                            this.button = 'Submit';
                            this.router.navigate(['/']);
                            this.invalidLogin = false;
                        } else {
                            // alert(response.msg);
                            if (
                                response.msg ==
                                "MSIS9659: Invalid 'username' or 'password'."
                            ) {
                                this.isLoading = false;
                                this.router.navigate(['/pages/error']);
                                this.invalidLogin = true;
                            } else {
                                alert(response.msg);
                                this.isLoading = false;
                                this.invalidLogin = true;
                            }
                        }
                    },
                    error: (err: HttpErrorResponse) => {
                        //debugger;
                        this.router.navigate(['/pages/access']);
                        this.isLoading = false;
                        this.invalidLogin = true;
                    },
                });
        }
        // this.submitButton.nativeElement.disabled = false;
    };

    loadUserRoles() {
        this.authService.Getrole();
    }
}
