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
    constructor(private auditService: AuditService, private fb: FormBuilder) {}

    loadingTable: boolean = true;
    filteredResult;
    result;

    filterForm: FormGroup;

    auditUIDs;
    departments;
    organisations;
    reviewYears;
    results;

    minDate: Date = new Date();

    ngOnInit(): void {
        this.minDate.setFullYear(this.minDate.getFullYear() - 1);

        this.auditService.getAuditDashboard().subscribe((res) => {
            this.result = res.data;
            this.filteredResult = this.result;

            this.auditUIDs = this.getUniqueValues(
                res.data,
                'audit_uid',
                'audit_uid'
            );
            this.departments = this.getUniqueValues(
                res.data,
                'department',
                'department_id'
            );
            this.organisations = this.getUniqueValues(
                res.data,
                'organization',
                'organization_id'
            );
            this.reviewYears = this.getUniqueValues(
                res.data,
                'review_year',
                'review_year'
            );

            this.results = this.getUniqueValues(res.data, 'results', 'results');

            this.filterForm = this.fb.group({
                department: null,
                org: null,
                range: null,
                result: null,
            });

            this.filterForm.valueChanges.subscribe((res) => {
                // console.log(res.range[0]?.getFullYear());

                this.filteredResult = this.result.filter((ele) => {
                    return (
                        (res.org?.name == null ||
                            ele.organization == res.org?.name) &&
                        (res.department?.name == null ||
                            ele.department == res.department?.name) &&
                        (res.result?.name == null ||
                            ele.results == res.result?.name)
                        // && ((res.range[0] == null && res.range[1] == null) ||
                        // (res.range[0] <= ele.ap_schedule_start_date &&
                        //     res.range[0] >= ele.ap_schedule_start_date))
                    );
                });
            });

            this.loadingTable = false;
        });
    }

    downloadcav() {
        this.auditService.downloadCSV().subscribe((res) => {
            console.log(res['blob']);
        });
    }

    getUniqueValues(arr, element, element_code) {
        // create an empty object to store unique page names
        let unique = {};
        // filter the array and return only unique objects based on page_name
        return arr
            .filter((obj) => {
                if (!unique[obj[element]]) {
                    unique[obj[element]] = true;
                    return true;
                }
                return false;
            })
            .map((obj) => {
                return {
                    name: obj[element],
                    code: obj[element_code],
                };
            });
    }

    filterArrayByElement(arr, element, value) {
        return arr.filter((obj) => {
            return obj[element] === value;
        });
    }
}
