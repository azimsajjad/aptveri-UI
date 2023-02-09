import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, finalize, forkJoin, map, throwError } from 'rxjs';
import { Organisation } from 'src/app/api/libraries';
import { audit } from 'src/app/api/roboticsAudit/audit';
import { AuditService } from 'src/app/service/audit.service';
import { BannerService } from 'src/app/service/librariesservice';

@Component({
    selector: 'app-audit-page',
    templateUrl: './audit-page.component.html',
    styleUrls: ['./audit-page.component.scss'],
})
export class AuditPageComponent implements OnInit {
    audits: audit[];
    loading: boolean = true;
    isAuditEdit: boolean;
    selectedAudit: audit[];

    selectedbannerdata: any;
    filteredAuditBanner: any[];
    auditBanner: any[];

    selectedaudituniversedata: any;
    filteredAuditUniverse: any[];
    AuditUniverse: any[];

    listOfusers: any[];
    filteredlistOfusers: any[];

    showTable: boolean = true;

    auditForm: FormGroup;
    allOrg: Organisation[];
    filteredOrg: Organisation[];

    @ViewChild('dt') table: Table;

    constructor(
        private auditService: AuditService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private libraryService: BannerService
    ) {}

    ngOnInit(): void {
        this.loading = true;

        let getAudit = this.auditService.sendGetAllAuditRequest();
        let getBanner = this.auditService.sendGetBannerRequest();
        let getAuditUniverse = this.auditService.getAuditUniverseLevel2(0);
        let getAllUser = this.auditService.sendGetallusersRequest();
        let getAllOrg = this.libraryService.getAllOrganizations();

        forkJoin([
            getAudit,
            getBanner,
            getAuditUniverse,
            getAllUser,
            getAllOrg,
        ]).subscribe((resp: any) => {
            this.audits = resp[0].data.map((ele) => {
                Object.keys(ele).forEach((element) => {
                    if (element.includes('date')) {
                        if (
                            new Date(ele[element]).getTime() == -62135618008000
                        ) {
                            ele[element] = null;
                        }
                    }
                });
                return ele;
            });
            this.auditBanner = resp[1].data;
            this.AuditUniverse = resp[2].data.data;
            this.listOfusers = resp[3].data;
            this.allOrg = resp[4].data;

            this.loading = false;
        });
    }

    getAudit() {
        this.auditService.sendGetAllAuditRequest().subscribe((result: any) => {
            result.data.map((ele) => {
                Object.keys(ele).forEach((element) => {
                    if (element.includes('date')) {
                        if (
                            new Date(ele[element]).getTime() == -62135618008000
                        ) {
                            ele[element] = null;
                        }
                    }
                });
                return ele;
            });
            this.audits = result.data;
            this.loading = false;
        });
    }

    saveAudit() {
        this.loading = true;
        this.auditForm
            .get('banner_id')
            .setValue(+this.getBannerId(this.auditForm.get('banner_id').value));
        this.auditForm
            .get('au_level_2_id')
            .setValue(
                +this.getAuditUniverseId(
                    this.auditForm.get('au_level_2_id').value
                )
            );

        const result2 =
            this.auditForm.get('user_access_id').value?.toString() == 'null' ||
            this.auditForm.get('user_access_id').value?.toString() == ''
                ? '0'
                : this.auditForm.get('user_access_id').value?.toString();
        this.auditForm
            .get('user_access_id')
            .setValue(this.auditForm.get('user_access_id').value?.toString());
        this.auditForm
            .get('organization_id')
            .setValue(
                this.auditForm
                    .get('organization_id')
                    .value.organization_id.toString()
            );

        if (this.auditForm.value.audit_id == null) {
            this.auditForm.removeControl('audit_id');
            this.auditService
                .sendPostAuditRequest(this.auditForm.value)
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
                        this.showTable = true;
                        this.loading = false;
                        this.getAudit();
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Audit Created',
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
        } else {
            this.auditService
                .sendPutAuditRequest(
                    this.auditForm.get('audit_id').value,
                    this.auditForm.value
                )
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
                        this.selectedAudit = null;
                        this.showTable = true;
                        this.loading = false;
                        this.getAudit();
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Audit Updated',
                            life: 3000,
                        });
                    } else {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Info',
                            detail: res.message,
                            life: 3000,
                        });
                    }
                });
        }
    }

    deleteAudit(audit: audit) {
        this.loading = true;

        this.auditService
            .getAuditProgram(0, audit.audit_id)
            .pipe(map((res) => res.data))
            .subscribe((res) => {
                this.loading = false;
                if (res.length > 0) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'INFO !!',
                        detail: 'Delete is not allowed',
                        life: 3000,
                    });
                } else {
                    this.confirmationService.confirm({
                        header: 'Confirmation!',
                        message:
                            'Are you sure you want to delete selected Audit?',
                        icon: 'pi pi-exclamation-triangle',
                        accept: () => {
                            this.auditService
                                .sendDeleteAuditRequest(audit.audit_id)
                                .pipe(
                                    finalize(() => {
                                        this.selectedAudit = null;
                                        this.getAudit();
                                    })
                                )
                                .subscribe((res) => {
                                    if (res.data) {
                                        this.messageService.add({
                                            severity: 'success',
                                            summary: 'Successful',
                                            detail: 'Audit Deleted',
                                            life: 3000,
                                        });
                                    } else {
                                        this.messageService.add({
                                            severity: 'info',
                                            summary: 'Info',
                                            detail: res.message,
                                            life: 3000,
                                        });
                                    }
                                });
                        },
                        reject: () => {},
                    });
                }
            });
    }

    openNew(audit) {
        this.selectedbannerdata = '';
        this.selectedaudituniversedata = '';
        this.isAuditEdit = false;

        if (audit) {
            this.loading = true;
            this.auditService
                .getAuditProgram(0, audit.audit_id)
                .pipe(map((res) => res.data))
                .subscribe((res) => {
                    this.loading = false;
                    if (res.length > 0) {
                        this.showTable = false;
                        this.isAuditEdit = true;
                    } else {
                        this.showTable = false;
                    }
                });
        } else {
            this.showTable = false;
        }

        this.auditForm = this.fb.group({
            organization_id: [
                this.getOrg(audit?.organization_id) || null,
                Validators.required,
            ],
            audit_id: audit ? audit.audit_id : null,
            acp_audit: [audit ? audit.acp_audit : false, Validators.required],
            au_level_2_id: [
                audit
                    ? this.getAuditUniverseSelection(audit.au_level_2_id)
                    : null,
                Validators.required,
            ],
            audit_board_id: [
                audit ? audit.audit_board_id : null,
                Validators.required,
            ],
            audit_name: [audit ? audit.audit_name : null, Validators.required],
            audit_schedule: audit ? audit.audit_schedule : null,
            banner_id: [
                audit ? this.getBannerSelection(audit.department_id) : null,
                Validators.required,
            ],
            end_date: audit
                ? audit.end_date == '0001-01-01T00:00:00'
                    ? null
                    : this.getLocalDateTime(audit.end_date)
                : null,
            last_run_date: audit ? audit.last_run_date : null,
            quarter: [audit ? audit.quarter : 1, Validators.required],
            results_url: audit ? audit.results_url : null,
            review_year: [
                audit ? audit.review_year : 2023,
                Validators.required,
            ],
            start_date: audit
                ? audit.start_date == '0001-01-01T00:00:00'
                    ? null
                    : this.getLocalDateTime(audit.start_date)
                : null,
            user_access_id: [
                audit
                    ? audit.user_access_id.split(',').map((ele) => {
                          return +ele;
                      })
                    : '0',
            ],
            created_by: audit ? audit.created_by : 0,
        });
    }

    selectRow(ele: audit) {
        this.selectedAudit = [ele];

        this.auditService
            .sendNavigateAuditRequest(
                ele.audit_id,
                ele.user_access_id != '0' ? 'yes' : 'no'
            )
            .subscribe((res) => {
                if (res.data) {
                    if (ele.user_access_id == '0' && ele.acp_audit == true) {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Info',
                            detail: 'Access Denied',
                            life: 3000,
                        });
                    } else {
                        console.log('go');
                    }
                } else {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Info',
                        detail: res.message,
                        life: 3000,
                    });
                }
            });
    }

    doOnSelectBanner(event) {
        // debugger;
        const str = event;
        const result = str.split('-');
        this.selectedbannerdata = result[2].trim();
    }

    filterBanner(event) {
        const filtered: any[] = [];
        const filteredall: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.auditBanner.length; i++) {
            const AuditBanner = this.auditBanner[i];
            if (AuditBanner.department != null) {
                if (
                    AuditBanner.department
                        .toString()
                        .toLowerCase()
                        .indexOf(query.toLowerCase()) == 0 ||
                    AuditBanner.department_uid
                        .toString()
                        .toLowerCase()
                        .indexOf(query.toLowerCase()) == 0
                ) {
                    filtered.push(
                        AuditBanner.department_uid +
                            ' - ' +
                            AuditBanner.department
                    );
                    filteredall.push(AuditBanner);
                }
            }
        }
        this.filteredAuditBanner = filtered;
    }

    doOnSelectAuditUniverse(event) {
        //debugger;
        const str = event;
        const result = str.split('-');
        this.selectedaudituniversedata = result[2].trim();
    }

    filterAU(event) {
        const filtered: any[] = [];
        const filteredall: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.AuditUniverse.length; i++) {
            const AuditUniverse = this.AuditUniverse[i];
            if (
                AuditUniverse.au_level_2_desc
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1 ||
                AuditUniverse.au_level_2_uid
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1
            ) {
                filtered.push(
                    AuditUniverse.au_level_2_desc +
                        ' - ' +
                        AuditUniverse.au_level_2_uid
                );
                filteredall.push(AuditUniverse);
            }
        }
        this.filteredAuditUniverse = filtered;
    }

    filterusers(event) {
        //debugger;
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.listOfusers.length; i++) {
            const resultuserdata = this.listOfusers[i];
            if (
                resultuserdata.fullName
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                filtered.push(resultuserdata);
            }
        }

        this.filteredlistOfusers = filtered;
    }

    filterOrg(event) {
        this.filteredOrg = [];
        for (let i = 0; i < this.allOrg.length; i++) {
            let org = this.allOrg[i];
            if (
                org.organization
                    .toLowerCase()
                    .indexOf(event.query.toLowerCase()) == 0
            ) {
                this.filteredOrg.push(org);
            }
        }
    }

    getOrg(id) {
        return this.allOrg.find((x) => x.organization_id == id);
    }

    getBannerSelection(id: number) {
        let x = this.auditBanner.filter((ele) => {
            return ele.department_id == id;
        })[0];
        return x.department_uid + ' - ' + x.department;
    }

    getBannerId(val: String) {
        let x = this.auditBanner.filter((ele) => {
            return ele.department_uid + ' - ' + ele.department == val;
        })[0];
        return x.department_id;
    }

    getAuditUniverseSelection(id: number) {
        let x = this.AuditUniverse.filter((ele) => {
            return ele.au_level_2_id == id;
        })[0];
        return x.au_level_2_desc + ' - ' + x.au_level_2_uid;
    }

    getAuditUniverseId(val: String) {
        let x = this.AuditUniverse.filter((ele) => {
            return ele.au_level_2_desc + ' - ' + ele.au_level_2_uid == val;
        })[0];
        return x.au_level_2_id;
    }

    getLocalDateTime(time: Date) {
        if (time == null) {
            return new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                0,
                0,
                0
            );
        } else {
            return new Date(
                moment(time)
                    .subtract(new Date().getTimezoneOffset(), 'minute')
                    .toISOString()
            );
        }
    }

    quarterList = [
        { quarter: 1, code: 1 },
        { quarter: 2, code: 2 },
        { quarter: 3, code: 3 },
        { quarter: 4, code: 4 },
    ];

    acp_auditList = [
        { acp_audit: 'Yes', code: true },
        { acp_audit: 'No', code: false },
    ];
}
