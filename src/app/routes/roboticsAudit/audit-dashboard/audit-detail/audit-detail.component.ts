import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize, throwError } from 'rxjs';
import { AuditService } from 'src/app/service/audit.service';

@Component({
    selector: 'app-audit-detail',
    templateUrl: './audit-detail.component.html',
    styleUrls: ['./audit-detail.component.scss'],
    providers: [MessageService],
})
export class AuditDetailComponent implements OnInit {
    auditTestHistory;
    auditTestHistoryForm: FormGroup;

    constructor(
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private auditService: AuditService,
        private _formbuilder: FormBuilder,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.auditTestHistory = this.config.data;
        console.log(this.auditTestHistory);

        this.auditTestHistoryForm = this._formbuilder.group({
            audit_history_id: this.auditTestHistory.audit_history_id,
            notes: this.auditTestHistory.notes,
            results: this.auditTestHistory.results,
            freeze: this.auditTestHistory.freeze == 0 ? false : true,
        });

        // this.auditTestHistoryForm
        //     .get('freeze')
        //     .valueChanges.subscribe((res) => {
        //         this.auditService
        //             .changeHistoryStatus(
        //                 this.auditTestHistory.audit_history_id,
        //                 this.auditTestHistoryForm.get('notes').value,
        //                 this.auditTestHistoryForm.get('results').value,
        //                 this.auditTestHistoryForm.get('freeze').value
        //             )
        //             .subscribe((res) => {
        //                 console.log(res);
        //             });
        //     });
    }

    saveTestHistory() {
        this.auditService
            .changeHistoryStatus(
                this.auditTestHistoryForm.get('audit_history_id').value,
                this.auditTestHistoryForm.get('notes').value,
                this.auditTestHistoryForm.get('results').value,
                this.auditTestHistoryForm.get('freeze').value
            )
            .pipe(
                catchError((err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!!',
                        detail: 'Something Went Wrong !!',
                        life: 3000,
                    });
                    this.auditTestHistoryForm.reset();
                    return throwError(err);
                }),
                finalize(() => {
                    this.ref.close();
                })
            )
            .subscribe((res) => {
                console.log(res);

                if (res.data) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Audit Test History Edited !!',
                        life: 3000,
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!!',
                        detail: 'Something Went Wrong !!',
                        life: 3000,
                    });
                }
            });
    }
}
