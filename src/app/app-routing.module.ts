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
import { AuthGuard } from './guards/auth.guard';
import { LicenseComponent } from './routes/utilities/license/license.component';
import { OrganizationComponent } from './routes/utilities/organization/organization.component';

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
                            path: 'pages/organization',
                            component: OrganizationComponent,
                        },
                        { path: 'pages/license', component: LicenseComponent },
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
