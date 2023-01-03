import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, map, throwError } from 'rxjs';
import {
    AULevel4,
    DataAULevel3,
    DataAULevel4,
} from 'src/app/api/auditUniverse';
import { AuditUniverseService } from 'src/app/service/audituniverseservice';
import { AuthService } from 'src/app/service/auth.service';

@Component({
    selector: 'app-au-level4',
    templateUrl: './au-level4.component.html',
    styleUrls: ['./au-level4.component.scss'],
})
export class AuLevel4Component implements OnInit {
    constructor(
        private auditUniverseService: AuditUniverseService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public accountSvr: AuthService
    ) {}

    @Input() AULevel3Selection: DataAULevel3[] = [];

    loading: boolean = true;
    aul_4_Dialog: boolean = false;

    AULevel4: DataAULevel4[] = [];
    selectedAULevel4: DataAULevel4[];

    aul4Form: FormGroup;

    ngOnInit(): void {}

    ngOnChanges() {
        this.getAuditUniverse();
    }

    getAuditUniverse() {
        if (this.AULevel3Selection.length > 0) {
            this.AULevel3Selection.forEach((ele) => {
                this.auditUniverseService
                    .getAuditUniverseLevel4(ele.au_level_3_id)
                    .subscribe((res: AULevel4) => {
                        this.AULevel4 = res.data;
                        this.loading = false;
                    });
            });
        } else if (this.AULevel3Selection == []) {
            this.AULevel4 = null;
            this.selectedAULevel4 = null;
        }
    }

    selectRow(aul_4: DataAULevel4) {
        this.selectedAULevel4 = [aul_4];
    }

    open(aul_4: DataAULevel4 = null) {
        this.aul_4_Dialog = true;
        this.aul4Form = this.fb.group({
            au_level_1_id: this.AULevel3Selection[0].au_level_1_id,
            au_level_2_id: this.AULevel3Selection[0].au_level_2_id,
            au_level_3_id: this.AULevel3Selection[0].au_level_3_id,
            au_level_4_id: aul_4 ? aul_4.au_level_4_id : null,
            au_level_4_desc: [
                aul_4 ? aul_4.au_level_4_desc : null,
                Validators.required,
            ],
            au_level_4_definiton: [
                aul_4 ? aul_4.au_level_4_definiton : null,
                Validators.required,
            ],
            au_level_4_comments: aul_4 ? aul_4.au_level_4_comments : null,
            section_no: [aul_4 ? aul_4.section_no : null, Validators.required],
        });
    }

    submitAUL4Form() {
        this.loading = true;
        if (this.aul4Form.get('au_level_4_id').value == null) {
            this.auditUniverseService
                .addAuditUniverseLevel4(this.aul4Form.value)
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
                        this.aul_4_Dialog = false;
                        this.getAuditUniverse();
                        this.loading = false;
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
                .editAuditUniverseLevel4(this.aul4Form.value)
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
                        this.aul_4_Dialog = false;
                        this.getAuditUniverse();
                        this.selectedAULevel4 = null;
                        this.loading = false;
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
        }
    }

    deleteAuditUniverse(aul_4: DataAULevel4) {
        this.confirmationService.confirm({
            header: 'Confirmation!',
            message: 'Are you sure to delete this Audit Universe?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.loading = true;
                this.auditUniverseService
                    .deleteAuditUniverseLevel4(aul_4.au_level_4_id)
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
                            this.selectedAULevel4 = null;
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
                //  console.log('rejected');
                this.confirmationService.close();
            },
        });
    }
}
