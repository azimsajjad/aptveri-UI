import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { audit } from 'src/app/api/roboticsAudit/audit';
import { AuditService } from 'src/app/service/audit.service';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, finalize, map, throwError } from 'rxjs';
import * as moment from 'moment';

@Component({
    selector: 'app-audit',
    templateUrl: './audit.component.html',
    providers: [MessageService, ConfirmationService],
    styles: [
        `
            :host ::ng-deep .p-autocomplete-item {
                cursor: pointer;
                white-space: normal !important;
                position: relative;
                overflow: hidden;
            }
            :host ::ng-deep .p-multiselect {
                min-width: 15rem;
            }

            :host ::ng-deep .multiselect-custom-virtual-scroll .p-multiselect {
                min-width: 20rem;
            }

            :host ::ng-deep .multiselect-custom .p-multiselect-label {
                padding-top: 0.75rem;
                padding-bottom: 0.75rem;
            }

            :host
                ::ng-deep
                .multiselect-custom
                .country-item.country-item-value {
                padding: 0.25rem 0.5rem;
                border-radius: 3px;
                display: inline-flex;
                margin-right: 0.5rem;
                background-color: var(--primary-color);
                color: var(--primary-color-text);
            }

            :host
                ::ng-deep
                .multiselect-custom
                .country-item.country-item-value
                img.flag {
                width: 17px;
            }

            :host ::ng-deep .multiselect-custom .country-item {
                display: flex;
                align-items: center;
            }

            :host ::ng-deep .multiselect-custom .country-item img.flag {
                width: 18px;
                margin-right: 0.5rem;
            }

            :host ::ng-deep .multiselect-custom .country-placeholder {
                padding: 0.25rem;
            }
        `,
    ],
    styleUrls: ['audit.component.scss'],
})
export class AuditComponent implements OnInit {
    auditDialog: boolean;
    deleteauditDialog: boolean = false;
    deleteauditsDialog: boolean = false;
    output: string[];
    audits: audit[];
    users: any[];
    dataaudits: audit;
    audit: audit;
    loading: boolean = true;
    selectedaudits: audit[];

    // ------for BU_ID-----

    selectedbannerdata: any;
    filteredAuditBanner: any[];
    AuditBanner: any[];

    // ------for AU_ID-----
    selectedaudituniversedata: any;
    filteredAuditUniverse: any[];
    AuditUniverse: any[];

    // -------------for multiselect-------
    selectedMulti: string[] = [];
    listOfusers: any[];
    filteredlistOfusers: any[];
    SelectItem: any[];
    // -------------for multiselect-------
    acp_audit_val;
    user_access_val;
    //navigate proporty to audit program
    private app_URL = environment.app_url;
    name = 'Get Current Url Route Demo';
    currentRoute: string;

    //display the username
    // displaytheUsername :any;

    submitted: boolean;

    cols: any[];
    @ViewChild('dt1') table: Table;

    @ViewChild('filter') filter: ElementRef;

    @ViewChild('submitButton') submitButton: ElementRef;

    statuses: any[];

    rowsPerPageOptions = [5, 10, 20];

    auditForm: FormGroup;

    constructor(
        private auditService: AuditService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public accountSvr: AuthService,
        private router: Router,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.getaudit();
        this.getBanner();
        this.getAuditUniverse();
        this.getallusers();

        this.cols = [
            { field: 'audit_id', header: 'AUDIT ID' },
            { field: 'audit_uid', header: 'AUDIT UID' },
            { field: 'audit_board_id', header: 'AUDIT BOARD ID' },

            { field: 'audit_name', header: 'AUDIT NAME' },
            { field: 'banner_id', header: 'BANNER ID' },
            { field: 'au_level_2_id', header: 'AU LEVEL2 ID' },
            { field: 'review_year', header: 'REVIEW YEAR' },
            { field: 'quarter', header: 'QUARTER' },
            { field: 'start_date', header: 'START DATE' },
            { field: 'end_date', header: 'END DATE' },
            { field: 'acp_audit', header: 'ACP AUDIT' },
            { field: 'user_access_id', header: 'USER ACEESS ID' },
            { field: 'audit_schedule', header: 'AUDIT SCHEDULE' },
            { field: 'results_url', header: 'RESULT URL' },
            { field: 'last_run_date', header: 'LAST RUN DATE' },
        ];
    }
    ngAfterViewInit() {}
    //Get all the audits
    getaudit() {
        //debugger;
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
            // console.log(result);
            this.audits = result.data;
            this.loading = false;
        });
    }

    getallusers() {
        // debugger;
        this.auditService.sendGetallusersRequest().subscribe((result: any) => {
            //console.log(result);
            this.listOfusers = result.data;
            this.loading = false;
        });
    }
    saveaudit() {
        // debugger;
        this.submitButton.nativeElement.disabled = true;

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
                        this.auditDialog = false;
                        this.loading = false;
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.getaudit();
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
            console.log(this.auditForm.value);

            // this.auditForm.value['created_by'] =
            //     this.selectedaudits[0]['created_by'];

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
                        this.selectedaudits = null;
                        this.auditDialog = false;
                        this.loading = false;
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.getaudit();
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
                        //   console.log(res.message);
                    }
                });
        }
        //save the audit

        // debugger;
        // this.submitted = true;
        // this.dataaudits = {};
        // if (this.audit.audit_name.trim()) {
        //     if (this.audit.audit_id) {
        //         this.dataaudits.au_level_2_id = Number(
        //             this.selectedaudituniversedata
        //         );
        //         this.dataaudits.banner_id = Number(this.selectedbannerdata);
        //         if (Number.isNaN(this.dataaudits.au_level_2_id)) {
        //             this.doOnSelectAuditUniverse(
        //                 this.selectedaudituniversedata
        //             );
        //             this.dataaudits.au_level_2_id = Number(
        //                 this.selectedaudituniversedata
        //             );
        //         }
        //         if (Number.isNaN(this.dataaudits.banner_id)) {
        //             this.doOnSelectBanner(this.selectedbannerdata);
        //             this.dataaudits.banner_id = Number(this.selectedbannerdata);
        //         }
        //         this.dataaudits.audit_name = this.audit.audit_name;
        //         this.dataaudits.audit_board_id = this.audit.audit_board_id;
        //         this.dataaudits.quarter = this.audit.quarter;
        //         var ObjectOfuser_access_id;
        //         var idofUser = '';
        //         var arrayToObjectFromuser_access_id = this.SelectItem;
        //         for (
        //             let index = 0;
        //             index < arrayToObjectFromuser_access_id.length;
        //             index++
        //         ) {
        //             ObjectOfuser_access_id =
        //                 arrayToObjectFromuser_access_id[index];
        //             idofUser += ObjectOfuser_access_id.userId + ',';
        //         }
        //         var removedLastCommafromstring = idofUser.replace(/,\s*$/, '');
        //         this.dataaudits.user_access_id = removedLastCommafromstring;
        //         var checkingvalueofinput = this.audit.acp_audit + '';
        //         var valofACPAudit;
        //         if (checkingvalueofinput == 'true') {
        //             valofACPAudit = true;
        //         } else {
        //             valofACPAudit = false;
        //         }
        //         this.dataaudits.acp_audit = valofACPAudit;
        //         this.dataaudits.results_url = this.audit.results_url;
        //         this.dataaudits.review_year = this.audit.review_year;
        //         this.dataaudits.start_date = this.audit.start_date;
        //         this.dataaudits.end_date = this.audit.end_date;
        //         this.dataaudits.last_run_date = this.audit.last_run_date;
        //         //  const start_datetoISo = new Date(this.audit.start_date);
        //         //  this.dataaudits.start_date = start_datetoISo.toISOString();
        //         //  const end_datetoISo = new Date(this.audit.end_date);
        //         //  this.dataaudits.end_date = end_datetoISo.toISOString();
        //         //  const last_run_datetoISo = new Date(this.audit.last_run_date);
        //         //  this.dataaudits.last_run_date = last_run_datetoISo.toISOString();
        //         this.dataaudits.audit_schedule = this.audit.audit_schedule;
        //         this.auditService
        //             .sendPutAuditRequest(this.audit.audit_id, this.dataaudits)
        //             .subscribe((res) => {
        //                 if (res) {
        //                     this.getaudit();
        //                     this.messageService.add({
        //                         severity: 'success',
        //                         summary: 'Successful',
        //                         detail: 'Audit Updated',
        //                         life: 3000,
        //                     });
        //                 }
        //             });
        //     } else {
        //         this.dataaudits.au_level_2_id = Number(
        //             this.selectedaudituniversedata
        //         );
        //         this.dataaudits.banner_id = Number(this.selectedbannerdata);
        //         this.dataaudits.audit_name = this.audit.audit_name;
        //         this.dataaudits.audit_board_id = this.audit.audit_board_id;
        //         this.dataaudits.quarter = this.audit.quarter;
        //         var ObjectOfuser_access_id;
        //         var idofUser = '';
        //         var arrayToObjectFromuser_access_id = this.SelectItem;
        //         for (
        //             let index = 0;
        //             index < arrayToObjectFromuser_access_id?.length;
        //             index++
        //         ) {
        //             ObjectOfuser_access_id =
        //                 arrayToObjectFromuser_access_id[index];
        //             idofUser += ObjectOfuser_access_id.userId + ',';
        //         }
        //         var removedLastCommafromstring = idofUser.replace(/,\s*$/, '');
        //         this.dataaudits.user_access_id = removedLastCommafromstring;
        //         var checkingvalueofinput = this.audit.acp_audit + '';
        //         var valofACPAudit;
        //         if (checkingvalueofinput == 'true') {
        //             valofACPAudit = true;
        //         } else {
        //             valofACPAudit = false;
        //         }
        //         this.dataaudits.acp_audit = valofACPAudit;
        //         this.dataaudits.results_url = this.audit.results_url;
        //         this.dataaudits.review_year = this.audit.review_year;
        //         this.dataaudits.start_date = this.audit.start_date;
        //         this.dataaudits.end_date = this.audit.end_date;
        //         this.dataaudits.last_run_date = new Date(
        //             new Date().toString().split('GMT')[0] + ' UTC'
        //         )
        //             .toISOString()
        //             .split('')
        //             .reverse()
        //             .join('')
        //             .substring(8)
        //             .split('')
        //             .reverse()
        //             .join('');
        //         // const start_datetoISo = new Date(this.audit.start_date);
        //         // this.dataaudits.start_date = start_datetoISo.toISOString();
        //         // const end_datetoISo = new Date(this.audit.end_date);
        //         // this.dataaudits.end_date = end_datetoISo.toISOString();
        //         // const last_run_datetoISo = new Date(this.audit.last_run_date);
        //         // this.dataaudits.last_run_date = last_run_datetoISo.toISOString();
        //         this.dataaudits.audit_schedule = this.audit.audit_schedule;
        //         this.auditService
        //             .sendPostAuditRequest(this.dataaudits)
        //             .subscribe((result: any) => {
        //                 //console.log(result);
        //                 if (result) {
        //                     this.getaudit();
        //                     this.messageService.add({
        //                         severity: 'success',
        //                         summary: 'Successful',
        //                         detail: 'Audit Created',
        //                         life: 3000,
        //                     });
        //                 }
        //             });
        //     }
        //     this.audits = [...this.audits];
        //     this.auditDialog = false;
        //     this.audit = {};
        //     this.getaudit();
        //     this.selectedaudits = null;
        // }

        this.submitButton.nativeElement.disabled = false;
    }

    //update the audit
    editaudit(audit: audit) {
        //debugger;
        this.getaudit();
        this.auditDialog = true;
        const arrayToObject = Object.assign({}, ...this.selectedaudits);
        this.audit = { ...arrayToObject };

        //Bannner ID
        var banID = Number(this.audit.banner_id) - 1;
        var filterBan = this.AuditBanner[banID];
        var finalBannerIdshow =
            filterBan.banner_uid +
            ' - ' +
            filterBan.banner +
            ' - ' +
            filterBan.banner_id;
        this.selectedbannerdata = finalBannerIdshow;
        this.audit.banner_id = this.selectedbannerdata;

        //Audit ID
        var AuditUniID = Number(this.audit.au_level_2_id) - 1;
        var filterAUID = this.AuditUniverse[AuditUniID];
        var finalAUIDIdshow =
            filterAUID.au_level_2_desc +
            ' - ' +
            filterAUID.au_level_2_uid +
            ' - ' +
            filterAUID.au_level_2_id;
        this.selectedaudituniversedata = finalAUIDIdshow;
        this.audit.au_level_2_id = this.selectedaudituniversedata;

        var valofUserAccessID = this.audit.user_access_id;
        var totallengthofExistinguseravailable = this.listOfusers;
        var userExistIndb = valofUserAccessID.split(',');
        var findingObjectOfLIstofuser: string[] = [];
        for (var NoOfUser = 0; NoOfUser < userExistIndb.length; NoOfUser++) {
            findingObjectOfLIstofuser.push(
                this.listOfusers.find(
                    (x) => x.userId == userExistIndb[NoOfUser]
                )
            );
        }

        this.SelectItem = findingObjectOfLIstofuser;
        this.getaudit();
    }

    //delete the audit
    deleteaudit(audit: audit) {
        // this.deleteauditDialog = true;
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
                    this.audit = { ...audit };
                    this.confirmationService.confirm({
                        header: 'Confirmation!',
                        message:
                            'Are you sure you want to delete selected Audit?',
                        icon: 'pi pi-exclamation-triangle',
                        accept: () => {
                            this.confirmDelete();
                        },
                        reject: () => {
                            //     console.log('rejected');
                        },
                    });
                }
            });
    }

    confirmDelete() {
        this.deleteauditsDialog = false;
        this.deleteauditDialog = false;

        const arrayToObject = Object.assign({}, ...this.selectedaudits);
        this.audit = { ...arrayToObject };
        this.auditService
            .sendDeleteAuditRequest(this.audit.audit_id)
            .subscribe((res) => {
                // console.log(res);
                if (res.data) {
                    this.getaudit();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Audit Deleted',
                        life: 3000,
                    });
                    this.audit = {};
                } else {
                    this.getaudit();
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Info',
                        detail: res.message,
                        life: 3000,
                    });
                    this.audit = {};
                }
            });

        this.selectedaudits = null;
    }

    clear(table: Table) {
        table.clear();
        // this.filter.nativeElement.value = '';
    }

    isAuditEdit: boolean;

    openNew(audit) {
        this.audit = {};
        // this.audit.review_year = new Date().getFullYear();
        // this.audit.quarter = 1;
        this.selectedbannerdata = '';
        this.selectedaudituniversedata = '';
        // this.submitted = false;
        this.SelectItem = null;
        // audit ? (this.isAuditEdit = true) : (this.isAuditEdit = false);
        this.isAuditEdit = false;

        if (audit) {
            this.loading = true;
            this.auditService
                .getAuditProgram(0, audit.audit_id)
                .pipe(map((res) => res.data))
                .subscribe((res) => {
                    this.loading = false;
                    if (res.length > 0) {
                        this.auditDialog = true;
                        this.isAuditEdit = true;
                    } else {
                        this.auditDialog = true;
                    }
                });
        } else {
            this.auditDialog = true;
        }
        console.log(audit);

        this.auditForm = this.fb.group({
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
                audit ? audit.review_year : 2022,
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
        console.log(this.auditForm.value);
    }

    hideDialog() {
        this.auditDialog = false;
        this.submitted = false;
    }

    // -------------------BU_ID---------------------

    getBanner() {
        this.auditService.sendGetBannerRequest().subscribe((result: any) => {
            this.AuditBanner = result.data;
            this.loading = false;

            // console.log(result);
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
        for (let i = 0; i < this.AuditBanner.length; i++) {
            const AuditBanner = this.AuditBanner[i];
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

    // -------------------AU_ID---------------------

    getAuditUniverse() {
        //debugger;
        this.auditService.getAuditUniverseLevel2(0).subscribe((result: any) => {
            // console.log("audituniverse");
            // console.log(result);

            this.AuditUniverse = result.data.data;
            this.loading = false;
        });
    }

    doOnSelectAuditUniverse(event) {
        //debugger;
        const str = event;
        const result = str.split('-');
        this.selectedaudituniversedata = result[2].trim();
    }
    selectaudit(ele) {
        // debugger;
        // let testId = [];
        // this.auditSelection.forEach((ele) => {
        //     testId.push(ele.audit_id);
        // });
        //this.getaudit(ele.audit_id);
        //  this.isShown = false;
        // debugger;
        this.selectedaudits = [ele];

        this.user_access_val = 'no';
        if (this.selectedaudits[0].user_access_id != '0') {
            this.user_access_val = 'yes';
        }
        this.acp_audit_val = this.selectedaudits[0].acp_audit.toString();
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
    updateList(val) {
        //   debugger;
        // this.selectedBanners = null;

        if (val.length === 0) {
            for (let i = 0; i < this.audits.length; i++) {
                this.audits[i]['isDisable'] = false;
            }
        } else {
            let id = val[0];
            for (let i = 0; i < this.audits.length; i++) {
                if (this.audits[i]['audit_uid'] !== id.audit_uid) {
                    this.audits[i]['isDisable'] = true;
                }
            }
        }
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
    //to navigate to program audit
    ForwordTOAuditProgram(audit: audit) {
        const arrayToObject = Object.assign({}, ...[audit]);
        this.audit = { ...arrayToObject };
        //  debugger;
        let useraccessn = 'no';
        if (this.audit.user_access_id != '0') {
            useraccessn = 'yes';
        }
        this.auditService
            .sendNavigateAuditRequest(this.audit.audit_id, useraccessn)
            .subscribe((res) => {
                // console.log(res);
                if (res.data) {
                    // const test =
                    //     'pages/audit-program/' +
                    //     encodeURIComponent(
                    //         btoa(this.audit.audit_id.toString())
                    //     ) +
                    //     '/' +
                    //     encodeURIComponent(btoa(useraccessn.toString())) +
                    //     '/' +
                    //     encodeURIComponent(
                    //         btoa(this.audit.acp_audit.toString())
                    //     );
                    if (useraccessn == 'no' && this.audit.acp_audit == true) {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Info',
                            detail: 'Access Denied',
                            life: 3000,
                        });
                        this.audit = {};
                    } else {
                        this.router.navigateByUrl(
                            'pages/audit-program/' +
                                encodeURIComponent(
                                    btoa(this.audit.audit_id.toString())
                                ) +
                                '/' +
                                encodeURIComponent(
                                    btoa(useraccessn.toString())
                                ) +
                                '/' +
                                encodeURIComponent(
                                    btoa(this.audit.acp_audit.toString())
                                )
                        );
                    }
                } else {
                    this.getaudit();
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Info',
                        detail: res.message,
                        life: 3000,
                    });
                    this.audit = {};
                }
            });

        this.selectedaudits = null;

        //console.log(this.router.url);
    }

    //display the user value
    // DisplayuserValue(displaytheUsername){
    //   console.log( displaytheUsername);

    // }

    getBannerSelection(id: number) {
        console.log(id);

        let x = this.AuditBanner.filter((ele) => {
            return ele.department_id == id;
        })[0];
        return x.department_uid + ' - ' + x.department;
    }

    getBannerId(val: String) {
        let x = this.AuditBanner.filter((ele) => {
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
