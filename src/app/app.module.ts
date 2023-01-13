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

import { EventService } from './service/eventservice';
import { NodeService } from './service/nodeservice';
import { MenuService } from './service/app.menu.service';
import { ConfigService } from './service/app.config.service';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AccessComponent } from './components/access/access.component';
import { BannersDetailComponent } from './routes/libraries/banners-detail/banners-detail.component';
import { BannerService } from './service/librariesservice';
import { RiskDetailComponent } from './routes/libraries/risk-detail/risk-detail.component';
import { ControlDetailComponent } from './routes/libraries/control-detail/control-detail.component';
import { ScriptDetailComponent } from './routes/libraries/script-detail/script-detail.component';
import { ScriptService } from './service/scriptservices';
import { AuditUniverseService } from './service/audituniverseservice';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './guards/auth.guard';
import { httpInterceptor } from './Interceptor/httpInterceptor';
import { ErrorInterceptorService } from './Interceptor/errorInterceptor';
import { AuditProgramComponent } from './routes/roboticsAudit/audit-program/audit-program.component';
import { AuditService } from './service/audit.service';
import { AuditComponent } from './routes/roboticsAudit/audit/audit.component';
import { ResultsComponent } from './routes/roboticsAudit/results/results.component';
import { ViewResultComponent } from './routes/roboticsAudit/view-result/view-result.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuLevelAllComponent } from './routes/libraries/audit-universe-detail/au-level-all/au-level-all.component';
import { BannerComponent } from './routes/libraries/banner/banner.component';
import { PrimeNgModule } from './prime-ng.module';
import { AuditUniverseDetailComponent } from './routes/libraries/audit-universe-detail/audit-universe-detail.component';
import { AuLevel1Component } from './routes/libraries/audit-universe-detail/au-level1/au-level1.component';
import { AuLevel2Component } from './routes/libraries/audit-universe-detail/au-level2/au-level2.component';
import { AuLevel3Component } from './routes/libraries/audit-universe-detail/au-level3/au-level3.component';
import { AuLevel4Component } from './routes/libraries/audit-universe-detail/au-level4/au-level4.component';
import { AdhocService } from './service/adhoc.service';
import { AdhocTestComponent } from './routes/roboticsAudit/adhoc-test/adhoc-test.component';
import { LogsComponent } from './routes/utilities/logs/logs.component';
import { UploadComponent } from './routes/utilities/upload/upload.component';
import { UploadService } from './service/upload.service';
import { UsersComponent } from './routes/utilities/users/users.component';
import { OrganisationComponent } from './routes/libraries/organisation/organisation.component';

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
                    'http://192.168.1.9:5100',
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
        BannersDetailComponent,
        RiskDetailComponent,
        ControlDetailComponent,
        ScriptDetailComponent,
        AuditComponent,
        AuditProgramComponent,
        ResultsComponent,
        ViewResultComponent,
        AuLevelAllComponent,
        AuditUniverseDetailComponent,
        AuLevel1Component,
        AuLevel2Component,
        AuLevel3Component,
        AuLevel4Component,
        AdhocTestComponent,
        BannerComponent,
        LogsComponent,
        UploadComponent,
        UsersComponent,
        OrganisationComponent,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        EventService,
        BnNgIdleService,
        NodeService,
        MenuService,
        ConfigService,
        BannerService,
        AuthGuard,
        ScriptService,
        AuditUniverseService,
        AdhocService,
        AuditService,
        UploadService,
        { provide: HTTP_INTERCEPTORS, useClass: httpInterceptor, multi: true },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptorService,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
