import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { StyleClassModule } from 'primeng/styleclass';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
import { InputTextModule } from 'primeng/inputtext';

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
import { CalendarModule } from 'primeng/calendar';
import { ResultsComponent } from './routes/roboticsAudit/results/results.component';
import { ViewResultComponent } from './routes/roboticsAudit/view-result/view-result.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuLevelAllComponent } from './routes/libraries/audit-universe-detail/au-level-all/au-level-all.component';

export function tokenGetter() {
    return localStorage.getItem('jwt');
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AutoCompleteModule,
        AvatarModule,
        AvatarGroupModule,
        ButtonModule,
        CardModule,
        CalendarModule,
        ChartModule,
        ConfirmDialogModule,
        ConfirmPopupModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        PaginatorModule,
        InputSwitchModule,
        InputTextModule,
        PasswordModule,
        RippleModule,
        ScrollPanelModule,
        ScrollTopModule,
        TabViewModule,
        TagModule,
        TableModule,
        ToastModule,
        ToolbarModule,
        TooltipModule,
        ProgressBarModule,
        ProgressSpinnerModule,
        VirtualScrollerModule,
        AppCodeModule,
        StyleClassModule,
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
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        EventService,
        ,
        BnNgIdleService,
        NodeService,
        MenuService,
        ConfigService,
        BannerService,
        AuthGuard,
        ScriptService,
        AuditUniverseService,
        AuditService,
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
