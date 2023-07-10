import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppCodeModule } from './components/app-code/app.code.component';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MessagesComponent } from './components/messages/messages.component';
import { EmptyComponent } from './components/empty/empty.component';

import { MenuService } from './service/app.menu.service';
import { ConfigService } from './service/app.config.service';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AccessComponent } from './components/access/access.component';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './guards/auth.guard';
import { httpInterceptor } from './Interceptor/httpInterceptor';
import { ErrorInterceptorService } from './Interceptor/errorInterceptor';
import { BnNgIdleService } from 'bn-ng-idle';
import { PrimeNgModule } from './prime-ng.module';
import { DialogService } from 'primeng/dynamicdialog';
import { OrganizationComponent } from './routes/utilities/organization/organization.component';
import { LicenseComponent } from './routes/utilities/license/license.component';
import { UtilityService } from './service/utility.service';
import { ConfirmationService, MessageService } from 'primeng/api';

export function tokenGetter() {
    return localStorage.getItem('jwt');
}

@NgModule({
    imports: [
        PrimeNgModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AppCodeModule,
        FormsModule,
        ReactiveFormsModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: [
                    'https://localhost:7204',
                    'http://192.168.1.38:5100',
                    'https://localhost:8082',
                    'https://localhost:8081',
                ],
                disallowedRoutes: [],
            },
        }),
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        DashboardComponent,
        MessagesComponent,
        EmptyComponent,
        LoginComponent,
        ErrorComponent,
        NotfoundComponent,
        AccessComponent,
        OrganizationComponent,
        LicenseComponent,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        BnNgIdleService,
        MenuService,
        ConfigService,
        AuthGuard,
        DialogService,
        { provide: HTTP_INTERCEPTORS, useClass: httpInterceptor, multi: true },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptorService,
            multi: true,
        },
        MessageService,
        ConfirmationService,
        UtilityService,
    ],
    bootstrap: [AppComponent],
    entryComponents: [],
})
export class AppModule {}
