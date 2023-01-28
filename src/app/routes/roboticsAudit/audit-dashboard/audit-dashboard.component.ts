import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
    constructor(private auditService: AuditService) {}

    loadingTable: boolean = true;
    filteredResult;
    result;

    auditUIDs;
    selectedAuditUID = new FormControl(null);

    departments;
    selectedDepartment = new FormControl(null);

    organisations;
    selectedOrg = new FormControl(null);

    reviewYears;
    selectedReviewYear = new FormControl(null);

    results;
    selectedResult = new FormControl(null);

    ngOnInit(): void {
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

            this.loadingTable = false;
        });

        this.selectedAuditUID.valueChanges.subscribe((res) => {
            this.filteredResult = this.result.filter((ele) => {
                return ele.audit_uid == res.code;
            });
        });

        this.selectedDepartment.valueChanges.subscribe((res) => {
            this.filteredResult = this.result.filter((ele) => {
                return ele.department_id == res.code;
            });
        });

        this.selectedOrg.valueChanges.subscribe((res) => {
            this.filteredResult = this.result.filter((ele) => {
                return ele.organization_id == res.code;
            });
        });

        this.selectedReviewYear.valueChanges.subscribe((res) => {
            this.filteredResult = this.result.filter((ele) => {
                return ele.review_year == res.code;
            });
        });

        this.selectedResult.valueChanges.subscribe((res) => {
            this.filteredResult = this.result.filter((ele) => {
                return ele.results == res.code;
            });
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
