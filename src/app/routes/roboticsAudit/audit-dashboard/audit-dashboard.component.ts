import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Banner, Organisation } from 'src/app/api/libraries';
import { AuditService } from 'src/app/service/audit.service';
import { BannerService } from 'src/app/service/librariesservice';
import { saveAs } from 'file-saver';
import { DialogService } from 'primeng/dynamicdialog';
import { AuditDetailComponent } from './audit-detail/audit-detail.component';

@Component({
    selector: 'app-audit-dashboard',
    templateUrl: './audit-dashboard.component.html',
    styleUrls: ['./audit-dashboard.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class AuditDashboardComponent implements OnInit {
    constructor(
        private auditService: AuditService,
        private fb: FormBuilder,
        private dialogService: DialogService
    ) {}

    loadingTable: boolean = true;
    filteredResult;
    result;
    blob;

    filterForm: FormGroup;

    auditUIDs;
    departments;
    organisations;
    reviewYears;
    results;

    minDate: Date = new Date();

    ngOnInit(): void {
        this.minDate.setFullYear(this.minDate.getFullYear() - 1);

        this.getDashboard();
    }

    getDashboard() {
        this.auditService.getAuditTestHistory(0, 0).subscribe((res) => {
            this.result = res.data;
            console.log(this.result);
            // this.filteredResult = this.result.filter(
            //     (item, i, arr) =>
            //         arr.findIndex((t) => t.audit_id === item.audit_id) === i
            // );

            this.filteredResult = this.result.filter(
                (ath) => ath.audit_run_status == 1
            );
            // console.log(this.filteredResult);
            //   this.filteredResult = this.result;
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
                from: null,
                to: null,
                result: null,
                review_year: null,
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
                            ele.results == res.result?.name) &&
                        (res.review_year?.name == null ||
                            ele.review_year == res.review_year?.name)
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
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute(
            'href',
            'https://localhost:7204/api/Audit/auditdashbord/0/0/0/0/0'
        );
        link.setAttribute('download', `products.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        // this.auditService.downloadCSV().subscribe((res) => {
        //     console.log(res['blob']);
        //     var data = new Blob([res], { type: 'text/plain;charset=utf-8' });
        //     saveAs.saveAs(data, 'text.txt');
        // });

        // this.auditService.downloadCSV().subscribe((res) => {
        //     // // debugger;
        //     // // const a = document.createElement('a');
        //     // // const objectUrl = URL.createObjectURL(blob);
        //     // // a.href = objectUrl;
        //     // // a.download = 'ttt.csv';
        //     // // a.click();
        //     // // URL.revokeObjectURL(objectUrl);

        //     // var binaryData = [];
        //     // binaryData.push(blob); //My blob
        //     // var foo = URL.createObjectURL(
        //     //     new Blob(binaryData, { type: 'application/text' })
        //     // );
        //     // console.log(foo);
        //     var data = new Blob([res], { type: 'text/plain;charset=utf-8' });
        //     saveAs.saveAs(data, 'text.txt');
        //     // saveAs.saveAs(blob, 'text.csv');
        // });
    }

    getDetail(ele) {
        const dialogRef = this.dialogService.open(AuditDetailComponent, {
            data: ele,
            width: '80%',
        });

        dialogRef.onClose.subscribe(() => {
            this.getDashboard();
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

    getTwoDigit(val) {
        return ('0' + val).slice(-2);
    }
}
