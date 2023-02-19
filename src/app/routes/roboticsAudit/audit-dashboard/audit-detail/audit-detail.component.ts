import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
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
        private messageService: MessageService,
        private dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.auditTestHistory = this.config.data;

        this.auditTestHistoryForm = this._formbuilder.group({
            audit_history_id: this.auditTestHistory.audit_history_id,
            notes: this.auditTestHistory.notes,
            results: this.auditTestHistory.results,
        });
    }

    saveTestHistory() {
        this.auditService
            .editAuditTestHistory(
                this.auditTestHistoryForm.get('audit_history_id').value,
                this.auditTestHistoryForm.get('notes').value,
                this.auditTestHistoryForm.get('results').value
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
