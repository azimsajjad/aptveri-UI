import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MessagesComponent } from './components/messages/messages.component';
import { EmptyComponent } from './components/empty/empty.component';
import { AppMainComponent } from './app.main.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AccessComponent } from './components/access/access.component';
import { BannersDetailComponent } from './routes/libraries/banners-detail/banners-detail.component';
import { RiskDetailComponent } from './routes/libraries/risk-detail/risk-detail.component';
import { ControlDetailComponent } from './routes/libraries/control-detail/control-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { ScriptDetailComponent } from './routes/libraries/script-detail/script-detail.component';
import { ResultsComponent } from './routes/roboticsAudit/results/results.component';

import { AuditComponent } from './routes/roboticsAudit/audit/audit.component';
import { ViewResultComponent } from './routes/roboticsAudit/view-result/view-result.component';
import { AuLevelAllComponent } from './routes/libraries/audit-universe-detail/au-level-all/au-level-all.component';
import { BannerComponent } from './routes/libraries/banner/banner.component';
import { AuditUniverseDetailComponent } from './routes/libraries/audit-universe-detail/audit-universe-detail.component';
import { AdhocTestComponent } from './routes/roboticsAudit/adhoc-test/adhoc-test.component';
import { LogsComponent } from './routes/utilities/logs/logs.component';
import { UploadComponent } from './routes/utilities/upload/upload.component';
import { UsersComponent } from './routes/utilities/users/users.component';
import { OrganisationComponent } from './routes/libraries/organisation/organisation.component';
import { AuditDashboardComponent } from './routes/roboticsAudit/audit-dashboard/audit-dashboard.component';
import { MasterComponent } from './routes/utilities/master/master.component';

@NgModule({
    imports: [
        FormsModule,
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppMainComponent,
                    children: [
                        {
                            path: '',
                            component: DashboardComponent,
                            canActivate: [AuthGuard],
                        },
                        { path: 'uikit/message', component: MessagesComponent },

                        { path: 'pages/empty', component: EmptyComponent },

                        {
                            path: 'pages/audit-universe-all',
                            component: AuLevelAllComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/audit-universe',
                            component: AuditUniverseDetailComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/banners-detail',
                            component: BannersDetailComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/banner',
                            component: BannerComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/control-detail',
                            component: ControlDetailComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/risk-detail',
                            component: RiskDetailComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/script-detail',
                            component: ScriptDetailComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/audit',
                            component: AuditComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/results/:audit_id/:ap_id/:audit_test_id/:audit_history_id',
                            component: ResultsComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/results',
                            component: ResultsComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/view-result/:target_table/:auditTHname',
                            component: ViewResultComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/adhoc-test',
                            component: AdhocTestComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/logs',
                            component: LogsComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/upload',
                            component: UploadComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/users',
                            component: UsersComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/organisation',
                            component: OrganisationComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/audit-dashboard',
                            component: AuditDashboardComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'pages/master',
                            component: MasterComponent,
                            canActivate: [AuthGuard],
                        },
                    ],
                },

                { path: 'pages/login', component: LoginComponent },
                { path: 'pages/error', component: ErrorComponent },
                { path: 'pages/notfound', component: NotfoundComponent },
                { path: 'pages/access', component: AccessComponent },
                { path: '**', redirectTo: 'pages/notfound' },
            ],
            { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
