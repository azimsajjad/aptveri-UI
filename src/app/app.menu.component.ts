import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';

@Component({
    selector: 'app-menu',
    template: `
        <div class="layout-menu-container">
            <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
                <li
                    app-menu
                    class="layout-menuitem-category text-l font-bold mb-3"
                    *ngFor="let item of model; let i = index"
                    [item]="item"
                    [index]="i"
                    [root]="true"
                    role="none"
                >
                    <div
                        class="layout-menuitem-root-text"
                        [attr.aria-label]="item.label"
                    >
                        {{ item.label }}
                    </div>
                    <ul role="menu">
                        <li
                            class="font-normal mt-1"
                            app-menuitem
                            *ngFor="let child of item.items"
                            [item]="child"
                            [index]="i"
                            role="none"
                        ></li>
                    </ul>
                </li>
            </ul>
        </div>
    `,
})
export class AppMenuComponent implements OnInit {
    model: any[];

    constructor(public appMain: AppMainComponent) {}

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/'],
                    },
                ],
            },
            {
                label: 'Libraries',
                items: [
                    {
                        label: 'Organisation',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/pages/organisation'],
                    },
                    {
                        label: 'Department',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/pages/banner'],
                    },
                    {
                        label: 'Audit Universe',
                        icon: 'pi pi-fw pi-user-edit',
                        items: [
                            {
                                label: 'Create',
                                icon: 'pi pi-fw pi-pencil',
                                routerLink: ['/pages/audit-universe'],
                            },
                            {
                                label: 'Read',
                                icon: 'pi pi-fw pi-book',
                                routerLink: ['/pages/audit-universe-all'],
                            },
                        ],
                    },
                    {
                        label: 'Risk',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/risk-detail'],
                    },
                    {
                        label: 'Control',
                        icon: 'pi pi-fw pi-tablet',
                        routerLink: ['/pages/control-detail'],
                    },
                    {
                        label: 'Script',
                        icon: 'pi pi-fw pi-table',
                        routerLink: ['/pages/script-detail'],
                    },
                ],
            },
            {
                label: 'Robotic Audits',
                items: [
                    {
                        label: 'Audit',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/pages/audit'],
                    },
                    {
                        label: 'Ad-Hoc Test',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/adhoc-test'],
                    },
                    {
                        label: 'Audti Dashboard',
                        icon: 'pi pi-fw pi-chart-pie',
                        routerLink: ['/pages/audit-dashboard'],
                    },
                ],
            },
            {
                label: 'Utilites',
                items: [
                    {
                        label: 'Logs',
                        icon: 'pi pi-code',
                        routerLink: ['/pages/logs'],
                    },
                    {
                        label: 'Upload',
                        icon: 'pi pi-upload',
                        routerLink: ['/pages/upload'],
                    },
                    {
                        label: 'Users',
                        icon: 'pi pi-users',
                        routerLink: ['/pages/users'],
                    },
                    {
                        label: 'Master',
                        icon: 'pi pi-box',
                        routerLink: ['/pages/master'],
                    },
                ],
            },
        ];
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = <HTMLDivElement>event.target;
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
