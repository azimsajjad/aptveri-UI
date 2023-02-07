import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { AuditService } from 'src/app/service/audit.service';

@Component({
    selector: 'app-test-history',
    templateUrl: './test-history.component.html',
    styleUrls: ['./test-history.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class TestHistoryComponent implements OnInit, OnChanges {
    @Input() auditTest;

    loading: boolean = true;
    auditTestHistory;
    auditTHSelection;

    res_target_table;
    res_auditTHname;

    auditTestHistoryForm: FormGroup;

    constructor(
        private auditService: AuditService,
        private _formbuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {}

    deleteAuditHistroy(ele) {
        if (ele.job_run_status == 5) {
            this.confirmationService.confirm({
                message: 'Are you sure to delete this history?',
                header: 'Confirmation',
                accept: () => {
                    this.auditService
                        .deleteAuditTestHistory(ele.audit_history_id)
                        .pipe(
                            catchError((err) => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'ERROR!!',
                                    detail: 'Something Went Wrong !!',
                                    life: 3000,
                                });
                                // console.log(err);
                                return throwError(err);
                            })
                        )
                        .subscribe((res) => {
                            if (res.data) {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Successful',
                                    detail: 'Audit Test History Deleted !!',
                                    life: 3000,
                                });
                                this.getTestHistory();
                                this.auditTHSelection = null;
                            } else {
                                this.messageService.add({
                                    severity: 'info',
                                    summary: 'Info Message',
                                    detail: res.message,
                                    life: 6000,
                                });
                            }
                        });
                },
                reject: () => {
                    //  console.log('rejected');
                },
            });
        } else {
            this.messageService.add({
                severity: 'info',
                summary: 'Info Message',
                detail: 'Cannot delete job is still ' + ele.job_run_status_text,
                life: 6000,
            });
        }
    }

    getTestHistory() {
        if (this.auditTest) {
            let ids = [];
            let x = [];
            this.auditTest.forEach((element) => {
                ids.push(element.audit_test_id);
            });

            ids.forEach((ele, index) => {
                this.auditService
                    .getAuditTestHistory(0, ele)
                    .subscribe((res) => {
                        res.data.map((ele) => {
                            Object.keys(ele).forEach((element) => {
                                if (element.includes('date')) {
                                    if (
                                        new Date(ele[element]).getTime() ==
                                        -62135618008000
                                    ) {
                                        ele[element] = null;
                                    } else {
                                        ele[element] = new Date(ele[element]);
                                    }
                                }
                            });
                            x.push(ele);
                            return ele;
                        });

                        if (index == ids.length - 1) {
                            this.auditTestHistory = x;
                            this.auditTestHistory.sort(
                                (a, b) =>
                                    b.audit_history_id - a.audit_history_id
                            );
                            this.loading = false;
                        }
                    });
            });
        }
    }

    ngOnChanges(): void {
        this.getTestHistory();
    }

    selecthistory() {
        console.log(this.auditTHSelection);
    }

    editHistroy(ele) {
        let testId = [];
        this.res_target_table = ele.target_table;
        this.res_auditTHname = ele.audit_history_uid;

        this.auditTestHistoryForm = this._formbuilder.group({
            audit_history_id: ele.audit_history_id,
            notes: ele.notes,
            results: ele.results,
        });
    }

    getTwoDigit(val) {
        return ('0' + val).slice(-2);
    }
}
