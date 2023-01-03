import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, map, throwError } from 'rxjs';
import {
    AULevel2,
    DataAULevel1,
    DataAULevel2,
} from 'src/app/api/auditUniverse';
import { AuditUniverseService } from 'src/app/service/audituniverseservice';
import { AuthService } from 'src/app/service/auth.service';

@Component({
    selector: 'app-au-level2',
    templateUrl: './au-level2.component.html',
    styleUrls: ['./au-level2.component.scss'],
})
export class AuLevel2Component implements OnInit {
    constructor(
        private auditUniverseService: AuditUniverseService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public accountSvr: AuthService
    ) {}

    @Input() AULevel1Selection: DataAULevel1[] = [];
    @Output() AULevel2Event = new EventEmitter<any>();

    loading: boolean = true;
    aul_2_Dialog: boolean = false;

    AULevel2: DataAULevel2[];
    selectedAULevel2: DataAULevel2[];

    aul2Form: FormGroup;

    ngOnInit(): void {}

    ngOnChanges() {
        this.AULevel2Event.emit([]);
        this.getAuditUniverse();
    }

    getAuditUniverse() {
        if (this.AULevel1Selection.length > 0) {
            this.AULevel1Selection.forEach((ele) => {
                this.auditUniverseService
                    .getAuditUniverseLevel2(ele.au_level_1_id)
                    .subscribe((res: AULevel2) => {
                        this.AULevel2 = res.data;
                        this.loading = false;
                    });
            });
        } else {
            this.selectedAULevel2 = [];
            // this.getSelection([]);
        }
    }

    getSelection(selection: DataAULevel2) {
        this.selectedAULevel2 = [selection];
        this.AULevel2Event.emit(this.selectedAULevel2);
    }

    open(aul_2: DataAULevel2 = null) {
        this.aul_2_Dialog = true;

        this.aul2Form = this.fb.group({
            au_level_1_id: this.AULevel1Selection[0].au_level_1_id,
            au_level_2_id: aul_2 ? aul_2.au_level_2_id : null,
            au_level_2_desc: [
                aul_2 ? aul_2.au_level_2_desc : null,
                Validators.required,
            ],
            section_no: [aul_2 ? aul_2.section_no : null, Validators.required],
        });
    }

    submitAUL2Form() {
        this.loading = true;
        if (this.aul2Form.get('au_level_2_id').value == null) {
            this.auditUniverseService
                .addAuditUniverseLevel2(this.aul2Form.value)
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
                        this.loading = false;
                        this.aul_2_Dialog = false;
                    })
                )
                .subscribe((res) => {
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
                .editAuditUniverseLevel2(this.aul2Form.value)
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
                        this.loading = false;
                        this.aul_2_Dialog = false;
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

    deleteAuditUniverse(aul_2: DataAULevel2) {
        this.confirmationService.confirm({
            header: 'Confirmation!',
            message: 'Are you sure to delete this Audit Universe?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.loading = true;
                this.auditUniverseService
                    .deleteAuditUniverseLevel2(aul_2.au_level_2_id)
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
                            this.selectedAULevel2 = null;
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
                                detail: 'Something Went Wrong !!',
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
