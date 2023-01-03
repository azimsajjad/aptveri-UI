import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, throwError } from 'rxjs';
import {
    AULevel3,
    DataAULevel2,
    DataAULevel3,
} from 'src/app/api/auditUniverse';
import { AuditUniverseService } from 'src/app/service/audituniverseservice';
import { AuthService } from 'src/app/service/auth.service';

@Component({
    selector: 'app-au-level3',
    templateUrl: './au-level3.component.html',
    styleUrls: ['./au-level3.component.scss'],
})
export class AuLevel3Component implements OnInit {
    constructor(
        private auditUniverseService: AuditUniverseService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public accountSvr: AuthService
    ) {}

    @Input() AULevel2Selection: DataAULevel2[] = [];
    @Output() AULevel3Event = new EventEmitter<any>();

    loading: boolean = true;
    aul_3_Dialog: boolean = false;

    AULevel3: DataAULevel3[] = [];
    selectedAULevel3: DataAULevel3[];

    aul3Form: FormGroup;

    ngOnInit(): void {}

    ngOnChanges() {
        this.AULevel3Event.emit([]);
        this.getAuditUniverse();
    }

    getAuditUniverse() {
        if (this.AULevel2Selection.length > 0) {
            this.AULevel2Selection.forEach((ele) => {
                this.auditUniverseService
                    .getAuditUniverseLevel3(ele.au_level_2_id)
                    .subscribe((res: AULevel3) => {
                        this.AULevel3 = res.data;
                        this.loading = false;
                    });
            });
        } else if (this.AULevel2Selection == null) {
            this.AULevel3 = null;
            this.selectedAULevel3 = [];
            // this.getSelection([]);
        }
    }

    getSelection(selection: DataAULevel3) {
        this.selectedAULevel3 = [selection];
        this.AULevel3Event.emit(this.selectedAULevel3);
    }

    open(aul_3: DataAULevel3 = null) {
        console.log(aul_3);

        this.aul_3_Dialog = true;
        this.aul3Form = this.fb.group({
            au_level_1_id: this.AULevel2Selection[0].au_level_1_id,
            au_level_2_id: this.AULevel2Selection[0].au_level_2_id,
            au_level_3_id: aul_3 ? aul_3.au_level_3_id : null,
            au_level_3_desc: [
                aul_3 ? aul_3.au_level_3_desc : null,
                Validators.required,
            ],
            au_level_3_definiton: [
                aul_3 ? aul_3.au_level_3_definiton : null,
                Validators.required,
            ],
            au_level_3_comments: aul_3 ? aul_3.au_level_3_comments : null,
            section_no: [aul_3 ? aul_3.section_no : null, Validators.required],
        });
    }

    submitAUL3Form() {
        this.loading = true;
        if (this.aul3Form.get('au_level_3_id').value == null) {
            this.auditUniverseService
                .addAuditUniverseLevel3(this.aul3Form.value)
                .pipe(
                    catchError((err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'ERROR!!',
                            detail: 'Something Went Wrong !!',
                            life: 3000,
                        });
                        return throwError(err);
                    }),
                    finalize(() => {
                        this.aul_3_Dialog = false;
                        this.getAuditUniverse();
                        this.loading = false;
                    })
                )
                .subscribe((res: any) => {
                    if (res.data) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'SUCCESS!!',
                            detail: 'Audit Universe Added!!',
                            life: 3000,
                        });
                    } else {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'INFO!!',
                            detail: res.message,
                            life: 3000,
                        });
                    }
                });
        } else {
            this.auditUniverseService
                .editAuditUniverseLevel3(this.aul3Form.value)
                .pipe(
                    catchError((err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'ERROR!!',
                            detail: 'Something Went Wrong !!',
                            life: 3000,
                        });
                        return throwError(err);
                    }),
                    finalize(() => {
                        this.aul_3_Dialog = false;
                        this.getAuditUniverse();
                        this.selectedAULevel3 = null;
                        this.loading = false;
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'SUCCESS!!',
                            detail: 'Audit Universe Edited!!',
                            life: 3000,
                        });
                    } else {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'INFO!!',
                            detail: res.message,
                            life: 3000,
                        });
                    }
                });
        }
    }

    deleteAuditUniverse(aul_3: DataAULevel3) {
        this.confirmationService.confirm({
            header: 'Confirmation!',
            message: 'Are you sure to delete this Audit Universe?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                (this.loading = true),
                    this.auditUniverseService
                        .deleteAuditUniverseLevel3(aul_3.au_level_3_id)
                        .pipe(
                            catchError((err) => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'ERROR!!',
                                    detail: 'Something Went Wrong !!',
                                    life: 3000,
                                });
                                return throwError(err);
                            }),
                            finalize(() => {
                                this.getAuditUniverse();
                                this.selectedAULevel3 = null;
                                this.loading = false;
                            })
                        )
                        .subscribe((res) => {
                            if (res.data) {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'SUCCESS!!',
                                    detail: 'Deleted Succesful!!',
                                    life: 3000,
                                });
                            } else {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'ERROR!!',
                                    detail: res.message,
                                    life: 3000,
                                });
                            }
                        });
                this.confirmationService.close();
            },
            reject: () => {
                //   console.log('rejected');
                this.confirmationService.close();
            },
        });
    }
}
