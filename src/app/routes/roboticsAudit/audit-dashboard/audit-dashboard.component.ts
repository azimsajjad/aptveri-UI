import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Banner, Organisation } from 'src/app/api/libraries';
import { AuditService } from 'src/app/service/audit.service';
import { BannerService } from 'src/app/service/librariesservice';

@Component({
    selector: 'app-audit-dashboard',
    templateUrl: './audit-dashboard.component.html',
    styleUrls: ['./audit-dashboard.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class AuditDashboardComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private libraryService: BannerService,
        private auditService: AuditService
    ) {}

    loadingTable: boolean = true;
    filterDialog: boolean = false;
    result;
    allOrg: Organisation[];
    allDept: Banner[];

    filterForm: FormGroup;

    resultsOpt = [
        { name: 'Pass', code: 'pass' },
        { name: 'Fail', code: 'fail' },
    ];

    ngOnInit(): void {
        this.libraryService.getAllOrganizations().subscribe((res) => {
            this.allOrg = res.data;
        });

        this.libraryService.sendGetRequest().subscribe((res) => {
            this.allDept = res.data;
        });

        this.getDashboard(null, null, null, null, null);
    }

    openDailog() {
        this.filterForm = this.fb.group({
            organization_id: null,
            department_id: null,
            ap_schedule_start_date: null,
            ap_schedule_end_date: null,
            results: null,
        });

        this.filterDialog = true;
    }

    filterFormSubmit() {
        this.filterForm
            .get('ap_schedule_start_date')
            .setValue(
                this.getFormattedDate(
                    this.filterForm.get('ap_schedule_start_date').value
                )
            );
        this.filterForm
            .get('ap_schedule_end_date')
            .setValue(
                this.getFormattedDate(
                    this.filterForm.get('ap_schedule_end_date').value
                )
            );
        this.filterForm
            .get('results')
            .setValue(this.getResult(this.filterForm.get('results').value));

        this.getDashboard(
            this.filterForm.get('organization_id').value,
            this.filterForm.get('department_id').value,
            this.filterForm.get('ap_schedule_start_date').value,
            this.filterForm.get('ap_schedule_end_date').value,
            this.filterForm.get('results').value
        );
    }

    getDashboard(
        org: Organisation,
        dept: Banner,
        ap_schedule_start_date,
        ap_schedule_end_date,
        results
    ) {
        this.auditService
            .getAuditDashboard(
                org?.organization_id || 1,
                dept?.department_id || 1,
                ap_schedule_start_date || null,
                ap_schedule_end_date || null,
                results || null
            )
            .subscribe((res) => {
                this.result = res.data;
                this.loadingTable = false;
                this.filterDialog = false;

                console.log(
                    this.getUniqueValues(this.result, 'audit_board_id')
                );

                console.log(
                    this.filterArrayByElement(
                        this.result,
                        'audit_board_id',
                        'TESTing'
                    )
                );
            });
    }

    getFormattedDate(date: Date): string {
        if (date) {
            const day = date?.getDate();
            const month = date?.getMonth() + 1;
            const year = date?.getFullYear();
            return `${day < 10 ? '0' + day : day}-${
                month < 10 ? '0' + month : month
            }-${year}`;
        } else {
            return null;
        }
    }

    getResult(result) {
        return result?.code;
    }

    getUniqueValues(arr, element) {
        return [...new Set(arr.map((i) => i[element]))];
    }

    filterArrayByElement(arr, element, value) {
        return arr.filter((obj) => {
            return obj[element] === value;
        });
    }
}
