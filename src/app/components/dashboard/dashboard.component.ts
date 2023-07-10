import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../service/app.config.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    chartData: any;
    pieData: any;
    basicData: any;
    successData: any;
    doughnutData: any;
    radarData: any;
    polarAreaData: any;

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

        this.successData = {
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
                    label: 'Test Exicuted',
                    backgroundColor: '#1c5b9c',
                    data: [65, 59, 80, 81, 56, 55, 40],
                },
                {
                    label: 'Success',
                    backgroundColor: '#86c143',
                    data: [28, 48, 40, 19, 20, 27, 9],
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

        this.doughnutData = {
            labels: ['Script', 'Control', 'Risk'],
            datasets: [
                {
                    data: [330, 473, 213],
                    backgroundColor: ['#1c5b9c', '#86c143', '#FFA726'],
                    hoverBackgroundColor: ['#1c5b9ccf', '#86c143d4', '#FFB74D'],
                },
            ],
        };

        this.radarData = {
            labels: [
                'Organisation',
                'Department',
                'Audit Universe',
                'Risk',
                'Control',
                'Script',
                'Running Script',
            ],
            datasets: [
                {
                    label: 'Total',
                    backgroundColor: 'rgba(28,91,156,0.2)',
                    borderColor: 'rgba(28,91,156,1)',
                    pointBackgroundColor: 'rgba(28,91,156,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(28,91,156,1)',
                    data: [65, 59, 90, 81, 56, 55, 40],
                },
                {
                    label: 'Success',
                    backgroundColor: 'rgba(134,193,67,0.2)',
                    borderColor: 'rgba(134,193,67,1)',
                    pointBackgroundColor: 'rgba(134,193,67,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(134,193,67,1)',
                    data: [28, 48, 40, 19, 96, 27, 100],
                },
            ],
        };

        this.polarAreaData = {
            datasets: [
                {
                    data: [11, 16, 7, 3, 14],
                    backgroundColor: [
                        '#1c5b9c',
                        '#86c143',
                        '#FFA726',
                        '#1c5b9c',
                        '#86c143',
                    ],
                    label: 'My dataset',
                },
            ],
            labels: ['Organisation', 'Department', 'Risk', 'Control', 'Script'],
        };
    }
}
