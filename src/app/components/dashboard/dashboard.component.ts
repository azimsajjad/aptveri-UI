import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import { AuditService } from 'src/app/service/audit.service';
import { AuditStatusCount } from 'src/app/api/libraries';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    chartData: any;
    pieData: any;
    basicData: any;

    constructor(public configService: ConfigService) {}

    ngOnInit() {
        this.pieData = {
            labels: ['Script', 'Control', 'Risk'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: ['#1c5b9c', '#86c143', '#FFA726'],
                    hoverBackgroundColor: ['#1c5b9ccf', '#86c143d4', '#FFB74D'],
                },
            ],
        };

        this.basicData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'Audit Program',
                    backgroundColor: '#1c5b9c',
                    data: [65, 59, 80, 81, 56, 55, 40],
                },
                {
                    label: 'Audit Test',
                    backgroundColor: '#86c143',
                    data: [28, 48, 40, 19, 86, 27, 90],
                },
            ],
        };

        this.chartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'Audit Program',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: '#1c5b9c',
                    borderColor: '#1c5b9c',
                    tension: 0.4,
                },
                {
                    label: 'Audit Test',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: '#86c143',
                    borderColor: '#86c143',
                    tension: 0.4,
                },
            ],
        };
    }
}
