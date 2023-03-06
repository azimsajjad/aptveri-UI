import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, finalize, throwError } from 'rxjs';
import { AULevel1, DataAULevel1 } from 'src/app/api/auditUniverse';
import { Organisation } from 'src/app/api/libraries';
import { AuditUniverseService } from 'src/app/service/audituniverseservice';
import { AuthService } from 'src/app/service/auth.service';
import { BannerService } from 'src/app/service/librariesservice';

@Component({
    selector: 'app-au-level1',
    templateUrl: './au-level1.component.html',
    styleUrls: ['./au-level1.component.scss'],
})
export class AuLevel1Component implements OnInit {
    constructor(
        private auditUniverseService: AuditUniverseService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public accountSvr: AuthService,
        private libraryService: BannerService
    ) {}

    loading: boolean = true;
    aul_1_Dialog: boolean = false;
    editMode: boolean = false;

    AULevel1: DataAULevel1[];
    selectedAULevel1: DataAULevel1[];
    organisation: Organisation[];
    filteredOrg: Organisation[];

    aul1Form: FormGroup;

    @Output() AULevel1Event = new EventEmitter<any>();

    ngOnInit(): void {
        this.libraryService.getAllOrganizations().subscribe((res) => {
            this.organisation = res.data;
            this.getAuditUniverse();
        });
    }

    getAuditUniverse() {
        this.auditUniverseService
            .getAuditUniverseLevel1()
            .pipe(
                catchError((err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!!',
                        detail: 'Something Went Wrong !!',
                        life: 3000,
                    });
                    this.loading = false;
                    return throwError(err);
                })
            )
            .subscribe((res: AULevel1) => {
                this.AULevel1 = res.data.map((ele) => {
                    ele['organisation'] = this.organisation.find(
                        (org) => org.organization_id == ele.organization_id
                    ).organization;
                    return ele;
                });
                this.loading = false;
            });
    }

    getSelection(selection: DataAULevel1) {
        this.selectedAULevel1 = [selection];
        this.AULevel1Event.emit(this.selectedAULevel1);
    }

    open(aul_1: DataAULevel1 = null) {
        aul_1 ? (this.editMode = true) : (this.editMode = false);
        this.selectedAULevel1 = [aul_1];

        this.aul1Form = this.fb.group({
            organization_id: [
                aul_1 ? this.getOrgnaisation(aul_1.organization_id) : null,
                Validators.required,
            ],
            au_level_1_desc: [
                aul_1 ? aul_1.au_level_1_desc : null,
                Validators.required,
            ],
            section_no: [aul_1 ? aul_1.section_no : null, Validators.required],
        });

        this.aul_1_Dialog = true;
    }

    submitAUL1Form() {
        this.loading = true;
        if (this.editMode) {
            this.aul1Form.addControl(
                'au_level_1_id',
                new FormControl(this.selectedAULevel1[0].au_level_1_id)
            );
            this.auditUniverseService
                .editAuditUniverseLevel1(this.aul1Form.value)
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
                        this.loading = false;
                        this.aul_1_Dialog = false;
                        this.selectedAULevel1 = null;
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.getAuditUniverse();
                        this.aul_1_Dialog = false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'SUCCESS!!',
                            detail: 'Audit Universe Edited!',
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
                .addAuditUniverseLevel1(this.aul1Form.value)
                .pipe(
                    catchError((err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'ERROR!!',
                            detail: 'Something Went Wrong !!',
                            life: 3000,
                        });
                        this.aul_1_Dialog = false;
                        return throwError(err);
                    }),
                    finalize(() => {
                        this.loading = false;
                        this.aul_1_Dialog = false;
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.getAuditUniverse();
                        this.aul_1_Dialog = false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'SUCCESS!!',
                            detail: 'Audit Universe Added!',
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

    deleteAuditUniverse(aul_1: DataAULevel1) {
        this.confirmationService.confirm({
            header: 'Confirmation!',
            message: 'Are you sure to delete this Audit Universe?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.auditUniverseService
                    .deleteAuditUniverseLevel1(aul_1.au_level_1_id)
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
                            this.selectedAULevel1 = null;
                            this.AULevel1Event.emit([]);
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
                            this.getAuditUniverse();
                            this.selectedAULevel1 = null;
                        } else {
                            this.messageService.add({
                                severity: 'info',
                                summary: 'INFO!!',
                                detail: res.message,
                                life: 3000,
                            });
                        }
                        this.getAuditUniverse();
                    });
                this.confirmationService.close();
            },
            reject: () => {
                // console.log('rejected');
                this.confirmationService.close();
            },
        });
    }

    // filters

    filterOrg(event) {
        this.filteredOrg = [];
        for (let i = 0; i < this.organisation.length; i++) {
            let org = this.organisation[i];
            if (
                org.organization
                    .toLowerCase()
                    .indexOf(event.query.toLowerCase()) == 0
            ) {
                this.filteredOrg.push(org);
            }
        }
    }

    getOrgnaisation(organization: any) {
        return this.organisation.find((x) => x.organization_id == organization);
    }

    clear(table: Table) {
        table.clear();
    }
}
