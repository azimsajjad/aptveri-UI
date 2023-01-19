import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuditProgram } from 'src/app/api/robotic-audit';
import { AuditService } from 'src/app/service/audit.service';
import { AuditUniverseService } from 'src/app/service/audituniverseservice';
import { AuthService } from 'src/app/service/auth.service';
import { ScriptService } from 'src/app/service/scriptservices';
import { ExportExcelService } from '../../../service/export-excel.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { audit } from 'src/app/api/roboticsAudit/audit';
import { formatDate } from '@angular/common';
import { catchError, finalize, forkJoin, map, throwError } from 'rxjs';
import { Dialog } from 'primeng/dialog';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { BannerService } from 'src/app/service/librariesservice';
import { debug } from 'console';

@Component({
    selector: 'app-audit-program',
    templateUrl: './audit-program.component.html',
    styleUrls: ['./audit-program.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class AuditProgramComponent implements OnInit {
    loadingP: boolean = true;
    loadingT: boolean = true;
    loadingTH: boolean = true;
    loadingF: boolean = false;
    loadingE: boolean = false;
    checktt: any[];
    arrData: any[];

    auditProgramDialog: boolean = false;
    auditTestDialog: boolean = false;
    auditTestHistoryDialog: boolean = false;
    showPopupText: boolean = false;
    showScriptPop: boolean = false;
    graphDialog: boolean = false;
    showGraph1: boolean = false;
    showGraph2: boolean = false;
    chartData1: any;
    chartData2: any;
    auditPSelection;
    auditTSelection;
    auditTHSelection;
    scriptSelection;
    auditId;
    auditTexcel;
    auditTheSelection;
    auditProgramMode;
    auditTestMode;
    audits: audit[];
    auditProgramForm: FormGroup;
    auditTestForm: FormGroup;
    auditTestHistoryForm: FormGroup;
    textDialogForm: FormGroup;
    loading: boolean = true;
    risk: any = [];
    filteredRisk: any;
    control: any = [];
    riskd: any = [];
    scriptd = [];
    controld: any = [];
    filteredControl: any;
    script = [];
    filteredScript;
    banner;
    filteredBanner;
    auditUniverse3;
    filteredAuditUniverse3;
    auditUniverse4;
    filteredAuditUniverse4;
    frequency;
    filteredFrequency;
    res_target_table;
    res_auditTHname;
    auditP;
    rolename;
    givenname;
    auditT;
    auditTH;
    datetime = new Date();
    checktargettables: any = 0;
    showScriptContent;
    popupText;
    targettables: any[];
    targettablesnew;
    count: number = 1;
    isFirst: boolean = true;
    useraccessn;
    acp_audit;
    private isButtonVisible = true;
    validatedata: boolean = false;
    today = new Date();
    currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    time = [
        { name: '0', code: 0 },
        { name: '1', code: 1 },
        { name: '2', code: 2 },
        { name: '3', code: 3 },
        { name: '4', code: 4 },
        { name: '5', code: 5 },
        { name: '6', code: 6 },
        { name: '7', code: 7 },
        { name: '8', code: 8 },
        { name: '9', code: 9 },
        { name: '10', code: 10 },
        { name: '11', code: 11 },
        { name: '12', code: 12 },
        { name: '13', code: 13 },
        { name: '14', code: 14 },
        { name: '15', code: 15 },
        { name: '16', code: 16 },
        { name: '17', code: 17 },
        { name: '18', code: 18 },
        { name: '19', code: 19 },
        { name: '20', code: 20 },
        { name: '21', code: 21 },
        { name: '22', code: 22 },
        { name: '23', code: 23 },
    ];

    @ViewChild('textDialog') textDialog: Dialog;

    @ViewChild('dt1') table1: Table;
    @ViewChild('dt2') table2: Table;
    @ViewChild('dt3') table3: Table;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild('submitButton') submitButton: ElementRef;
    @ViewChild('submitButtonaudit') submitButtonaudit: ElementRef;
    @ViewChild('submitButtonaudith') submitButtonaudith: ElementRef;

    constructor(
        private _formbuilder: FormBuilder,
        private scriptService: ScriptService,
        private auditUniverseService: AuditUniverseService,
        private auditService: AuditService,
        private messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private confirmationService: ConfirmationService,
        private router: Router,
        public accountSvr: AuthService,
        private libraryService: BannerService,
        private _location: Location
    ) {
        this.activatedRoute.params.subscribe((res) => {
            //  debugger;
            this.auditId = atob(res.audit_id);
            this.acp_audit = atob(res.acp_audit);
            this.useraccessn = atob(res.useraccessn);
        });
    }

    ngOnInit(): void {
        const token = localStorage.getItem('jwt');
        this.rolename = JSON.parse(
            window.atob(localStorage.getItem('jwt').split('.')[1])
        )['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        this.givenname = JSON.parse(
            window.atob(localStorage.getItem('jwt').split('.')[1])
        )['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];

        this.auditService.getAuditProgram(0, this.auditId).subscribe((res) => {
            this.getaudit(this.auditId);
            // let aud = this.auditUniverseService.getAuditUniverseLevel3Script(0);
            let freq = this.auditService.getFrequency();
            let scr = this.scriptService.getScript(0);
            let ban = this.auditService.sendGetBannerRequest();
            let aRisk = this.libraryService.sendGetriskRequest();
            let aControl = this.libraryService.sendGetcontrolRequest();

            // forkJoin([aud, freq, scr, ban, aRisk, aControl]).subscribe(
            forkJoin([freq, scr, ban, aRisk, aControl]).subscribe(
                (results: any) => {
                    // this.auditUniverse3 = results[0].data.data;
                    this.frequency = results[0].data;
                    this.script = results[1].data;
                    this.banner = results[2].data;
                    results[3].data.forEach((ele) => {
                        this.risk.push({
                            keyid: ele.risk_id,
                            keyuid: ele.risk_uid,
                            keyvalue: ele.risk,
                            business_objective: ele.business_objective,
                        });
                    });
                    results[4].data.forEach((ele) => {
                        this.control.push({
                            keyid: ele.control_id,
                            keyuid: ele.control_uid,
                            keyvalue: ele.control,
                            business_objective: ele.business_objective,
                        });
                    });

                    this.filteredFrequency = this.frequency.map((res) => {
                        return res.codeName;
                    });
                }
            );
            this.auditP = res.data;

            this.loadingP = false;
            if (this.auditP.length > 0) {
                this.auditPSelection = [this.auditP[0]];
                this.getTests();
                this.auditTHSelection = [this.auditTH];
            }
        });

        // console.log(this.audits[0].full_name);
    }
    isRiskEnable: boolean = true;
    isControlEnable: boolean = true;
    isScriptEnable: boolean = true;

    // getAllRiskControlScript() {
    //     this.libraryService.sendGetriskRequest().subscribe((res) => {
    //         console.log(res);
    //     });
    // }

    getAuditProgram() {
        this.auditService.getAuditProgram(0, this.auditId).subscribe((res) => {
            this.auditP = res.data;
            this.loadingP = false;
        });
    }

    isAUEdit: boolean;

    openP(auditPro: AuditProgram, type: string) {
        this.auditProgramMode = type;
        this.isAUEdit = false;
        type == 'new' ? (this.isAUEdit = false) : (this.isAUEdit = true);

        this.auditProgramForm = this._formbuilder.group({
            audit_id: this.auditId,
            audit_program_id: auditPro ? auditPro?.audit_program_id : null,
            ap_name: [auditPro ? auditPro?.ap_name : null, Validators.required],
            ap_desc: [auditPro ? auditPro?.ap_desc : null, Validators.required],
            au_level_3_id: [
                auditPro
                    ? this.getAuditUniverse(auditPro?.au_level_3_id)
                    : null,
                Validators.required,
            ],
            ap_schedule_date: [
                auditPro ? new Date(auditPro?.ap_schedule_date) : null,
            ],
            ap_schedule_time: [auditPro ? auditPro?.ap_schedule_time : 0],
            frequency_id: [
                auditPro ? this.getFrequency(auditPro?.frequency_id) : null,
            ],
            next_run: [auditPro ? new Date(auditPro?.next_run) : null],
            last_run: [auditPro ? new Date(auditPro?.last_run) : null, ,],
        });

        this.auditProgramDialog = true;

        this.auditProgramForm
            .get('frequency_id')
            .valueChanges.subscribe((res) => {
                if (res != null) {
                    this.auditProgramForm
                        .get('ap_schedule_date')
                        .setValidators(Validators.required);
                    this.auditProgramForm
                        .get('ap_schedule_date')
                        .updateValueAndValidity();
                    this.auditProgramForm
                        .get('ap_schedule_time')
                        .setValidators(Validators.required);
                    this.auditProgramForm
                        .get('ap_schedule_time')
                        .updateValueAndValidity();
                    this.auditProgramForm
                        .get('next_run')
                        .setValidators(Validators.required);
                    this.auditProgramForm
                        .get('next_run')
                        .updateValueAndValidity();
                } else {
                    this.auditProgramForm
                        .get('ap_schedule_date')
                        .clearValidators();
                    this.auditProgramForm
                        .get('ap_schedule_date')
                        .updateValueAndValidity();
                    this.auditProgramForm
                        .get('ap_schedule_time')
                        .clearValidators();
                    this.auditProgramForm
                        .get('ap_schedule_time')
                        .updateValueAndValidity();
                    this.auditProgramForm.get('next_run').clearValidators();
                    this.auditProgramForm
                        .get('next_run')
                        .updateValueAndValidity();
                }
            });
    }

    saveAudit() {
        this.submitButton.nativeElement.disabled = true;

        this.loadingP = true;
        this.auditProgramForm.value.frequency_id =
            this.getFrequencyCode(this.auditProgramForm.value.frequency_id) ||
            0;
        this.auditProgramForm.value.au_level_3_id =
            this.getAuditUniverseId(
                this.auditProgramForm.value.au_level_3_id
            ) || null;

        this.auditProgramForm.value.ap_schedule_date = this.getLocalDateTime(
            this.auditProgramForm.value.ap_schedule_date
        );
        this.auditProgramForm.value.next_run = this.getLocalDateTime(
            this.auditProgramForm.value.next_run
        );

        if (this.auditProgramMode == 'new') {
            this.auditService
                .addAuditProgram(this.auditProgramForm.value)
                .pipe(
                    catchError((err) => {
                        this.auditProgramDialog = false;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'ERROR!!',
                            detail: 'Something Went Wrong !!',
                            life: 3000,
                        });
                        // console.log(err);
                        this.loadingP = false;
                        return throwError(err);
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.auditProgramDialog = false;
                        this.loadingP = false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'New Audit Program Created !!',
                            life: 3000,
                        });
                        this.getAuditProgram();
                    } else {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'INFO !!',
                            detail: res.message,
                            life: 3000,
                        });
                        this.auditProgramDialog = false;
                        this.getAuditProgram();
                    }
                });
        } else {
            this.auditService
                .editAuditProgram(this.auditProgramForm.value)
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
                        this.auditProgramDialog = false;
                        this.loadingP = false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'New Audit Program Edited !!',
                            life: 3000,
                        });
                        this.auditPSelection = null;
                        this.getAuditProgram();
                    } else {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'INFO !!',
                            detail: res.message,
                            life: 3000,
                        });
                        this.auditProgramDialog = false;
                        this.loadingP = false;
                        this.auditPSelection = null;
                        this.getAuditProgram();
                    }
                });
        }
        this.submitButton.nativeElement.disabled = false;
    }

    deleteProgram(ele) {
        this.confirmationService.confirm({
            header: 'Confirmation',
            message: 'Are you sure to delte this Program?',
            accept: () => {
                this.loadingP = true;
                this.auditService
                    .deleteProgram(ele.audit_program_id)
                    .pipe(
                        catchError((err) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'ERROR!!',
                                detail: 'Something Went Wrong !!',
                                life: 3000,
                            });
                            // console.log(err);
                            this.loadingP = false;
                            return throwError(err);
                        })
                    )
                    .subscribe((res) => {
                        if (res.data) {
                            this.loadingP = false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Audit Program Deleted !!',
                                life: 3000,
                            });
                            this.getAuditProgram();
                            this.auditPSelection = null;
                        } else {
                            this.loadingP = false;
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Info Message',
                                detail: res.message,
                                life: 6000,
                            });
                            this.getAuditProgram();
                            this.auditPSelection = null;
                        }
                    });
            },
            reject: () => {
                // console.log('rejected');
            },
        });
    }

    selectRow(ele) {
        //  this.auditPSelection = [ele];
        this.getTests();
    }

    selectTest(ele) {
        let testId = [];
        this.auditTSelection.forEach((ele) => {
            testId.push(ele.audit_test_id);
        });

        this.getTestHistory(testId);
    }

    openT(auditTest, type: string) {
        //      console.log(this.auditPSelection);

        if (type == 'edit') {
            this.isRiskEnable = true;
            this.isControlEnable = true;
            this.isScriptEnable = true;
        }
        this.isRiskEnable = true;
        this.isControlEnable = true;
        this.isScriptEnable = true;
        this.auditTestMode = type;
        this.scriptSelection = auditTest;

        this.auditTestForm = this._formbuilder.group({
            audit_test_desc: [
                auditTest ? auditTest.audit_test_desc : null,
                Validators.required,
            ],
            banner_id: this.getBanner(
                auditTest
                    ? auditTest.department_id
                    : this.auditPSelection[0].department_id
            ),
            ap_id: this.auditPSelection[0].audit_program_id,
            risk_id: [
                // auditTest ? this.getRisk(auditTest.risk_id) : null,
                auditTest ? auditTest.riskkeyval : null,
                //  null,
                Validators.required,
            ],
            control_id: [
                // auditTest ? this.getControl(auditTest.control_id) : null,
                auditTest ? auditTest.controlkeyval : null,
                //  null,
                Validators.required,
            ],
            au_level_4_id: [
                auditTest
                    ? this.getAuditUniverse4(auditTest.au_level_4_id)
                    : null,
                Validators.required,
            ],
            script_id: [
                auditTest ? this.getScript(auditTest.script_id) : null,
                // null,
                //  auditTest ? auditTest.scriptkeyval : null,
                Validators.required,
            ],
            strore: auditTest
                ? auditTest.strore == true
                    ? 'Yes'
                    : 'No'
                : 'Yes',
            schedule_status: true,
            last_run_date: new Date(),
            schedule_start_datetime: [
                auditTest ? auditTest.schedule_start_datetime : null,
            ],
            schedule_end_datetime: [
                auditTest ? auditTest.schedule_end_datetime : null,
            ],
            scriptVariables: auditTest
                ? this._formbuilder.array(
                      auditTest.scriptVariables.map((scriptvar) => {
                          return this._formbuilder.group({
                              var_id: scriptvar.var_id,
                              var_name: scriptvar.var_name,
                              var_datatype: scriptvar.var_datatype,
                              var_value: [scriptvar.var_value],
                          });
                      })
                  )
                : this._formbuilder.array([]),
        });

        // if (type == 'edit') {
        //     this.onAuditUniverse4Select(
        //         this.getAuditUniverse4(auditTest.au_level_4_id)
        //     );
        //     this.onRiskSelect(this.getRisk(auditTest.risk_id));
        //     this.onControlSelect(this.getControl(auditTest.control_id));
        // }

        type == 'edit'
            ? this.onSelectScript(this.getScript(auditTest.script_id))
            : null;

        this.auditTestDialog = true;

        this.auditTestForm
            .get('au_level_4_id')
            .valueChanges.subscribe((res) => {
                if (res == '' || res == null) {
                    this.isRiskEnable = true;
                    this.isControlEnable = true;
                    this.isScriptEnable = true;
                    this.auditTestForm.get('risk_id').setValue(null);
                    this.auditTestForm.get('control_id').setValue(null);
                } else {
                    this.isRiskEnable = false;
                    this.isControlEnable = false;
                    this.isScriptEnable = false;
                }
            });

        this.auditTestForm.get('risk_id').valueChanges.subscribe((res) => {
            if (res == '' || res == null) {
                this.isControlEnable = true;
                this.isScriptEnable = true;
                this.auditTestForm.get('control_id').setValue(null);
            } else {
                this.isControlEnable = false;
                this.isScriptEnable = false;
            }
        });
    }

    loadingRisk: boolean = false;

    onAuditUniverse4Select(event) {
        this.loadingRisk = true;
        this.auditService
            .getScriptRisk(this.getAuditUniversel4Id(event))
            .subscribe((res) => {
                this.loadingRisk = false;
                this.riskd = res.data;
                this.auditTestForm.get('risk_id').setValue(null);
                this.auditTestForm.get('control_id').setValue(null);
                this.auditTestForm.get('script_id').setValue(null);
                this.scriptSelection = null;
            });
    }

    loadingControl: boolean = false;

    onRiskSelect(event) {
        this.loadingControl = true;
        this.auditService
            .getScriptControl(
                this.getAuditUniversel4Id(
                    this.auditTestForm.get('au_level_4_id').value
                ),
                this.getRiskId(event)
            )
            .subscribe((res) => {
                this.loadingControl = false;
                this.controld = res.data;
                this.auditTestForm.get('control_id').setValue(null);
                this.auditTestForm.get('script_id').setValue(null);
                this.scriptSelection = null;
            });
    }

    noScript: boolean = false;
    loadingScript: boolean = false;

    onControlSelect(event) {
        this.loadingScript = true;
        this.auditTestForm.get('script_id').setValue(null);
        this.scriptService
            .getAuditScript(
                this.getRiskId(this.auditTestForm.get('risk_id').value),
                this.getControlId(event),
                this.getAuditUniversel4Id(
                    this.auditTestForm.get('au_level_4_id').value
                )
            )
            .subscribe((res) => {
                this.scriptd = res.data;
                this.loadingScript = false;
                if (this.scriptd.length == 0) {
                    this.isScriptEnable = true;
                    this.noScript = true;
                } else {
                    this.isScriptEnable = false;
                    this.noScript = false;
                }
            });
    }

    onSelectScript(event) {
        this.scriptSelection = this.script.filter((ele) => {
            return ele.script_id == this.getScriptId(event);
        })[0];
        // console.log(this.scriptSelection);
        (<FormArray>this.auditTestForm.get('scriptVariables')).clear();

        this.scriptSelection.scriptVaribales.forEach((scriptvar) => {
            (<FormArray>this.auditTestForm.get('scriptVariables')).push(
                this._formbuilder.group({
                    var_id: scriptvar.var_id,
                    var_name: scriptvar.var_name,
                    var_datatype: scriptvar.var_datatype,
                    var_value: [scriptvar.var_value],
                })
            );
        });
    }

    saveAuditTest() {
        this.submitButtonaudit.nativeElement.disabled = true;

        this.loadingT = true;
        this.auditTestForm.value['script_sql'] = this.getScriptSql(
            this.auditTestForm.value.script_id
        );
        this.auditTestForm.value['version_id'] = this.getScriptVersionId(
            this.auditTestForm.value.script_id
        );
        this.auditTestForm.value['script_presto'] = this.getPrestoSql(
            this.auditTestForm.value.script_id
        );
        this.auditTestForm.value['target_table'] = this.script.filter((ele) => {
            if (
                ele.script_id ==
                this.getScriptId(this.auditTestForm.value.script_id)
            ) {
                return ele;
            }
        })[0].target_table;
        this.auditTestForm.value.script_id = this.getScriptId(
            this.auditTestForm.value.script_id
        );
        this.auditTestForm.value.au_level_4_id = this.getAuditUniversel4Id(
            this.auditTestForm.value.au_level_4_id
        );
        this.auditTestForm.value.control_id = this.getControlId(
            this.auditTestForm.value.control_id
        );
        this.auditTestForm.value.risk_id = this.getRiskId(
            this.auditTestForm.value.risk_id
        );
        this.auditTestForm.value.strore =
            this.auditTestForm.get('strore').value == 'Yes' ? true : false;
        this.auditTestForm.value.banner_id = this.getBannerId(
            this.auditTestForm.value.banner_id
        );
        // console.log(this.auditTestForm.value);

        if (this.auditPSelection[0].schedule_status) {
            this.auditTestForm.value.frequency =
                this.auditPSelection[0].frequency_id;
            this.auditTestForm.value.schedule_start_datetime =
                this.auditPSelection[0].ap_schedule_date;
            this.auditTestForm.value.schedule_end_datetime =
                this.auditPSelection[0].next_run;
            this.auditTestForm.value.schedule_run_time =
                this.auditPSelection[0].ap_schedule_time;
        } else {
            this.auditTestForm.value.frequency =
                this.auditPSelection[0].frequency_id;
            this.auditTestForm.value.schedule_start_datetime = new Date();
            this.auditTestForm.value.schedule_end_datetime = new Date();
            this.auditTestForm.value.schedule_status = false;
        }

        if (this.auditTestMode == 'new') {
            if (this.auditPSelection[0].schedule_status == false) {
                this.auditService
                    .addAuditTest(this.auditTestForm.value)
                    .pipe(
                        catchError((err) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'ERROR!!',
                                detail: 'Something Went Wrong !!',
                                life: 3000,
                            });
                            // console.log(err);
                            this.auditTestDialog = false;
                            this.loadingT = false;
                            return throwError(err);
                        }),
                        finalize(() => {
                            this.scriptService.getScript(0).subscribe((res) => {
                                this.script = res.data;
                            });
                        })
                    )
                    .subscribe((res) => {
                        if (res.data) {
                            this.auditProgramDialog = false;
                            this.loadingT = false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'New Audit Test Created !!',
                                life: 3000,
                            });
                            this.auditTestDialog = false;
                            this.getTests();
                        } else {
                            this.auditProgramDialog = false;
                            this.loadingT = false;
                            this.messageService.add({
                                severity: 'info',
                                summary: 'INFO!!',
                                detail: res.message,
                                life: 3000,
                            });
                            this.auditTestDialog = false;
                            this.getTests();
                        }
                    });
            } else {
                this.auditService
                    .scheduleTest(this.auditTestForm.value)
                    .pipe(
                        catchError((err) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'ERROR!!',
                                detail: 'Something Went Wrong !!',
                                life: 3000,
                            });
                            // console.log(err);
                            this.auditTestDialog = false;
                            this.loadingT = false;
                            return throwError(err);
                        }),
                        finalize(() => {
                            this.scriptService.getScript(0).subscribe((res) => {
                                this.script = res.data;
                            });
                        })
                    )
                    .subscribe((res) => {
                        if (res.data) {
                            this.auditProgramDialog = false;
                            this.loadingT = false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'New Audit Scheduled Test Created !!',
                                life: 3000,
                            });
                            this.auditTestDialog = false;
                            this.getTests();
                        } else {
                            this.auditProgramDialog = false;
                            this.loadingT = false;
                            this.messageService.add({
                                severity: 'info',
                                summary: 'INFO!!',
                                detail: res.message,
                                life: 3000,
                            });
                            this.auditTestDialog = false;
                            this.getTests();
                        }
                    });
            }
        } else {
            this.auditTestForm.value['audit_test_id'] =
                this.auditTSelection[0].audit_test_id;

            this.auditService
                .editAuditTest(this.auditTestForm.value)
                .pipe(
                    catchError((err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'ERROR!!',
                            detail: 'Something Went Wrong !!',
                            life: 3000,
                        });
                        this.loadingT = false;
                        this.auditTestDialog = false;
                        // console.log(err);
                        return throwError(err);
                    }),
                    finalize(() => {
                        this.scriptService.getScript(0).subscribe((res) => {
                            this.script = res.data;
                        });
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.auditProgramDialog = false;
                        this.loadingT = false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Audit Program Edited !!',
                            life: 3000,
                        });
                        this.auditTSelection = null;
                        this.auditTestDialog = false;
                        this.getTests();
                    } else {
                        this.auditProgramDialog = false;
                        this.loadingT = false;
                        this.messageService.add({
                            severity: 'info',
                            summary: 'INFO!!',
                            detail: res.message,
                            life: 3000,
                        });
                        this.auditTSelection = null;
                        this.auditTestDialog = false;
                        this.getTests();
                    }
                });
        }

        this.submitButtonaudit.nativeElement.disabled = false;
    }

    getTests() {
        let programId = [];
        let x = [];
        this.loadingT = true;
        this.auditPSelection.forEach((ele) => {
            return programId.push(ele.audit_program_id);
        });

        programId.forEach((ele, index) => {
            this.auditService.getAuditTest(0, ele).subscribe((res: any) => {
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
                    ele['banner_uid'] = this.banner?.filter((ele) => {
                        return ele.department_id == ele.department_id;
                    })[0].banner_uid;
                    x.push(ele);
                    return ele;
                });

                // res.data.forEach((element) => {
                //     element['banner_uid'] = this.banner?.filter((ele) => {
                //         return ele.banner_id == element.banner_id;
                //     })[0].banner_uid;
                //     x.push(element);

                //     // element.map((ele) => {
                //     //     console.log(Object.keys(ele));
                //     // });
                // });

                if (index == programId.length - 1) {
                    this.auditT = x;
                    this.auditT.sort((a, b) => {
                        b.audit_test_id - a.audit_test_id;
                    });
                    this.auditTSelection = this.auditT;
                    let h = [];
                    this.auditTSelection.forEach((element) => {
                        h.push(element.audit_test_id);
                    });
                    this.getTestHistory(h);
                    this.loadingT = false;
                }
            });
        });

        this.auditUniverse4 = this.auditService
            .getScriptUniLevel4(this.auditPSelection[0]?.au_level_3_id)
            .subscribe((res) => {
                this.auditUniverse4 = res.data;
            });
    }

    deleteTest(ele) {
        this.confirmationService.confirm({
            header: 'Confirmation',
            message: 'Are you sure to delete this test?',
            accept: () => {
                this.auditService
                    .deleteAuditTest(ele.audit_test_id)
                    .pipe(
                        catchError((err) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'ERROR!!',
                                detail: 'Something Went Wrong !!',
                                life: 3000,
                            });
                            // console.log(err);
                            this.loadingT = false;
                            return throwError(err);
                        })
                    )
                    .subscribe((res) => {
                        if (res.data) {
                            this.loadingT = false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Audit Test Deleted !!',
                                life: 3000,
                            });
                            this.getTests();
                            this.auditTSelection = null;
                        } else {
                            this.loadingT = false;
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Info Message',
                                detail: res.message,
                                life: 6000,
                            });
                            this.getTests();
                            this.auditTSelection = null;
                        }
                    });
            },
            reject: () => {
                //  console.log('rejected');
            },
        });
    }

    selecthistory() {
        //   console.log(this.auditTHSelection);
    }

    getTestHistory(testId: any) {
        this.auditTHSelection = null;
        let x = [];
        this.loadingTH = true;
        testId.forEach((ele, index) => {
            this.auditService.getAuditTestHistory(0, ele).subscribe((res) => {
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

                // res.data.forEach((element) => {
                //     x.push(element);
                // });
                if (index == testId.length - 1) {
                    this.auditTH = x;
                    this.auditTH.sort(
                        (a, b) => b.audit_history_id - a.audit_history_id
                    );
                    this.loadingTH = false;
                    if (this.isFirst) {
                        this.auditTHSelection = this.auditTH;
                        this.isFirst = !this.isFirst;
                    }
                }
            });
        });
    }

    runProgram() {
        let t = () => {
            let testId: Array<number> = [];
            this.auditT.forEach((ele) => {
                testId.push(ele.audit_test_id);
            });
            if (testId.length == 0) {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Info Message',
                    detail: 'There is no audit test to run!!',
                    life: 6000,
                });
            } else {
                this.auditService
                    .runAuditTest(testId)
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
                            if (res.data[0].code == 1) {
                                this.messageService.add({
                                    severity: 'info',
                                    summary: 'Info Message',
                                    detail: res.data[0].message,
                                    life: 6000,
                                });
                            } else {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Successful',
                                    detail: 'Audit Test Scheduled !!',
                                    life: 3000,
                                });
                                this.getTestHistory(testId);
                            }
                        } else {
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Info Message',
                                detail: res.message,
                                life: 3000,
                            });
                        }
                    });
            }
        };

        let checkSchedule: boolean = false;
        this.auditPSelection.forEach((element) => {
            if (element.schedule_status) {
                checkSchedule = true;
            }
        });

        if (checkSchedule) {
            this.confirmationService.confirm({
                header: 'Confirmation!',
                message:
                    'There are already some tests which are scheduled. Do you want to execute it now?',
                accept: () => {
                    t();
                },
                reject: () => {
                    // console.log('rejected');
                },
            });
        } else {
            t();
        }
    }

    runTest(test) {
        let t = () => {
            let testId: Array<number> = [];
            test.forEach((ele) => {
                testId.push(ele.audit_test_id);
            });
            this.auditService
                .runAuditTest(testId)
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
                        if (res.data[0].code == 1) {
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Info Message',
                                detail: res.data[0].message,
                                life: 6000,
                            });
                        } else {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Audit Test Scheduled !!',
                                life: 3000,
                            });
                        }
                        testId.forEach((element) => {
                            this.getTestHistory([element]);
                        });
                    } else {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Info Message',
                            detail: res.message,
                            life: 3000,
                        });
                    }
                });
        };

        let checkSchedule: boolean = false;
        this.auditTSelection.forEach((element) => {
            if (element.schedule_status) {
                checkSchedule = true;
            }
        });

        // console.log(checkSchedule);

        if (checkSchedule) {
            this.confirmationService.confirm({
                header: 'Confirmation',
                message: 'This is a Scheduled Test, Do you want to continue?',
                accept: () => {
                    t();
                },
                reject: () => {
                    //   console.log('rejected');
                },
            });
        } else {
            t();
        }
    }

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
                                this.getTestHistory([ele.audit_test_id]);
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

    editHistroy(ele) {
        let testId = [];
        this.res_target_table = ele.target_table;
        this.res_auditTHname = ele.audit_history_uid;

        // this.auditTH.forEach((ele) => {
        //     testId.push(ele.audit_history_uid);
        // });
        this.auditTestHistoryForm = this._formbuilder.group({
            audit_history_id: ele.audit_history_id,
            notes: ele.notes,
            results: ele.results,
        });
    }

    changeHistoryStatus(ele) {
        if (ele == null || ele == 'Fail') {
            this.auditTestHistoryForm.get('results').setValue('Pass');
        } else {
            this.auditTestHistoryForm.get('results').setValue('Fail');
        }
    }

    saveTestHistory() {
        this.submitButtonaudith.nativeElement.disabled = true;

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
                    // console.log(err);
                    this.auditTHSelection = null;
                    return throwError(err);
                })
            )
            .subscribe((res) => {
                if (res.data) {
                    this.auditTestHistoryDialog = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Audit Test History Edited !!',
                        life: 3000,
                    });
                    this.auditTHSelection = null;
                    let h = [];
                    this.auditTSelection.forEach((element) => {
                        h.push(element.audit_test_id);
                    });
                    this.getTestHistory(h);
                } else {
                    this.auditTestHistoryDialog = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!!',
                        detail: 'Something Went Wrong !!',
                        life: 3000,
                    });
                    this.auditTHSelection = null;
                    let h = [];
                    this.auditTSelection.forEach((element) => {
                        h.push(element.audit_test_id);
                    });
                    this.getTestHistory(h);
                }
            });
        this.submitButtonaudith.nativeElement.disabled = false;
    }

    changeStatus(program, event) {
        console.log(program.audit_program_id);
        console.log(event.checked);
        this.auditService
            .changeAuditScheduleStatus(
                program.audit_program_id,
                event.checked ? 1 : 0
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
                })
            )
            .subscribe((res) => {
                if (!res.data) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'INFO!!',
                        detail: res.message,
                        life: 3000,
                    });
                    this.getAuditProgram();
                }
            });
    }

    gettargettable(id: string) {
        this.auditService
            .sendGettargettableRequest(id)
            .pipe(
                map((resp) => resp.data),
                catchError((err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!!',
                        detail: 'Something Went Wrong !!',
                        life: 3000,
                    });
                    // console.log(err);
                    return throwError(err);
                }),
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe((res) => {
                res.map((res) => {
                    res.record_status == 0
                        ? (res.record_status = false)
                        : (res.record_status = true);
                    return res;
                });
                this.targettables = res;
                if (this.targettables.length > 0) {
                    this.validatedata = true;
                    //  this.showdata = false;
                } else {
                    this.validatedata = false;
                    //  this.showdata = true;
                }
                // console.log(res);
            });
    }

    async viewResults() {
        this.checktargettables = await this.auditService.checktargettablenew(
            this.res_target_table
        );
        if (this.checktargettables.data == 1) {
            this.confirmationService.confirm({
                message: 'Downloading will take time. Do you want to continue?',
                accept: async () => {
                    this.loadingF = true;

                    this.router.navigateByUrl(
                        'pages/view-result/' +
                            encodeURIComponent(btoa(this.res_target_table)) +
                            '/' +
                            encodeURIComponent(btoa(this.res_auditTHname))
                    );

                    //debugger;
                    // this.router.navigateByUrl(
                    //     'pages/results/' +
                    //         btoa(this.auditId) +
                    //         '/' +
                    //         btoa(this.auditTHSelection[0].ap_id) +
                    //         '/' +
                    //         btoa(this.auditTHSelection[0].audit_test_id) +
                    //         '/' +
                    // //         btoa(this.auditTHSelection[0].audit_history_id)
                    // // );
                    // // this.router.navigateByUrl(
                    // //     'pages/results/' +
                    // //         encodeURIComponent(btoa(this.auditId)) +
                    // //         '/' +
                    // //         encodeURIComponent(btoa(this.auditTHSelection[0].ap_id)) +
                    // //         '/' +
                    // //         encodeURIComponent(
                    // //             btoa(this.auditTHSelection[0].audit_test_id)
                    // //         ) +
                    // //         '/' +
                    // //         encodeURIComponent(
                    // //             btoa(this.auditTHSelection[0].audit_history_id)
                    // //         )
                    // // );
                    // //debugger;
                    // this.checktargettables = await this.auditService.checktargettablenew(
                    //     this.res_target_table
                    // );

                    //         // this.auditService
                    //         //     .checktargettable(this.res_target_table)
                    //         //     .subscribe((data) => {
                    //         //         //  console.log(data.data);
                    //         //         // debugger;
                    //         //         this.checktargettables = data.data;
                    //         if (this.checktargettables.data == 1) {
                    //             // this.gettargettable(this.res_target_table);

                    //     this.gettargettable(this.res_target_table);

                    //     this.targettablesnew =
                    //         await this.auditService.sendGettargettableRequestnew(
                    //             this.res_target_table
                    //         );
                    //     if (this.targettablesnew.data.length > 0) {
                    //         this.router.navigateByUrl(
                    //             'pages/view-result/' +
                    //                 encodeURIComponent(btoa(this.res_target_table))
                    //         );
                    //     } else {
                    //         this.messageService.add({
                    //             severity: 'error',
                    //             summary: 'ERROR!!',
                    //             detail: 'Target Table Does not have Data !!',
                    //             life: 3000,
                    //         });
                    //     }
                    // } else {
                    //     this.messageService.add({
                    //         severity: 'error',
                    //         summary: 'ERROR!!',
                    //         detail: 'Target Table Does not Exist !!',
                    //         life: 3000,
                    //     });
                    // }
                    // });
                },
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'ERROR!!',
                detail: 'Target Table Does not Exist !!',
                life: 3000,
            });
            this.loadingF = false;
        }
    }

    getGraph() {
        let programId = [];
        this.auditPSelection.forEach((element) => {
            programId.push(element.audit_program_id);
        });

        this.auditService
            .getChart(programId)
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
                let label1 = [];
                let label2 = [];
                let graphData1 = [];
                let graphData2 = [];
                res.data.forEach((element) => {
                    if (element.chartname == 'Excecution') {
                        label1.push(element.resultname);
                        graphData1.push(element.result_count);
                        if (element.result_count > 0) this.showGraph1 = true;
                        this.chartData1 = {
                            labels: label1,
                            datasets: [
                                {
                                    label: 'AP Level Graph',
                                    backgroundColor: ['#EB1D36', '#AB47BC'],
                                    data: graphData1,
                                },
                            ],
                        };
                    }
                    if (element.chartname == 'ExcecutionStatus') {
                        label2.push(element.resultname);
                        graphData2.push(element.result_count);
                        if (element.result_count > 0) this.showGraph2 = true;
                        this.chartData2 = {
                            labels: label2,
                            datasets: [
                                {
                                    label: 'AT Level Graph',
                                    backgroundColor: [
                                        '#EB1D36',
                                        '#AB47BC',
                                        '#42A5F5',
                                    ],
                                    data: graphData2,
                                },
                            ],
                        };
                    }
                });
                this.graphDialog = true;
            });
    }

    showScriptPopTitle;

    showScript(script, title) {
        this.showScriptPopTitle = title;
        this.showScriptContent = script;
        this.showScriptPop = true;
    }

    refreshHistory() {
        let testId = [];
        this.auditTSelection.forEach((ele) => {
            testId.push(ele.audit_test_id);
        });

        this.getTestHistory(testId);
    }

    getAPSelection(ele) {
        //  console.log(ele);
    }

    // filterPart

    filterControl(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.controld.length; i++) {
            const ele = this.controld[i];
            if (ele.keyvalue == null) {
                filtered.push(ele.keyvalue);
            } else if (
                ele.keyvalue
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1
            ) {
                filtered.push(ele.keyuid + ' - ' + ele.keyvalue);
            }
        }

        this.filteredControl = filtered;
    }

    getControlId(control: string): number {
        let x = this.control.filter((ele) => {
            return ele.keyuid + ' - ' + ele.keyvalue == control;
        });

        return x[0].keyid;
    }

    getControl(id: number) {
        let x = this.control.filter((ele) => {
            return ele.keyid == id;
        });

        return x[0].keyuid + ' - ' + x[0].keyvalue;
    }

    filterRisk(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.riskd.length; i++) {
            const ele = this.riskd[i];
            if (ele.keyvalue == null) {
                filtered.push(ele.keyvalue);
            } else if (
                ele.keyvalue
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1 ||
                ele.business_objective
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1
            ) {
                filtered.push(
                    ele.keyuid +
                        ' - ' +
                        ele.keyvalue +
                        ' - ' +
                        ele.business_objective
                );
            }

            this.filteredRisk = filtered;
        }
    }

    getRiskId(risk: string): number {
        let x = this.risk.filter((ele) => {
            return ele.keyuid == risk.split(' - ')[0];
        });

        return x[0].keyid;
    }

    getRisk(id: number) {
        let x = this.risk.filter((ele) => {
            return ele.keyid == id;
        });

        return x[0].keyuid + ' - ' + x[0].keyvalue;
    }

    filterAuditUniverse4(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.auditUniverse4.length; i++) {
            const ele = this.auditUniverse4[i];
            if (ele.keyvalue == null) {
                filtered.push(ele.keyvalue);
            } else if (
                ele.keyvalue
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1
            ) {
                filtered.push(ele.keyvalue);
            }

            this.filteredAuditUniverse4 = filtered;
        }
    }

    filterBanner(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.banner.length; i++) {
            const ele = this.banner[i];
            if (ele.banner_uid == null) {
                filtered.push(ele.banner_uid);
            } else if (
                ele.banner_uid
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1 ||
                ele.banner
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1
            ) {
                filtered.push(ele.banner_uid + ' - ' + ele.banner);
            }
            this.filteredBanner = filtered;
        }
    }

    getAuditUniversel4Id(audit: string) {
        let x = this.auditUniverse4.filter((ele) => {
            return ele.keyvalue == audit;
        });

        return x[0].keyid;
    }

    getAuditUniverse4(id: number) {
        let x = this.auditUniverse4.filter((ele) => {
            return ele.keyid == id;
        });

        return x[0].keyvalue;
    }

    filterScript(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.scriptd.length; i++) {
            const ele = this.scriptd[i];
            if (ele.script_defination == null) {
                filtered.push(ele.script_defination);
            } else if (
                ele.script_uid
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1 ||
                ele.version
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1 ||
                ele.script_defination
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1
            ) {
                filtered.push(
                    ele.script_uid +
                        ' - ' +
                        ele.version +
                        ' - ' +
                        ele.script_defination
                );
            }

            this.filteredScript = filtered;
        }
    }

    getScriptId(script: string) {
        let x = this.script.filter((ele) => {
            return (
                ele.script_uid +
                    ' - ' +
                    ele.version +
                    ' - ' +
                    ele.script_defination ==
                script
            );
        });

        return x[0].script_id;
    }

    getScript(id: number) {
        let x = this.script.filter((ele) => {
            if (ele.keyid) return ele.keyid == id;
            else return ele.script_id == id;
        });

        return (
            x[0].keyvalue ||
            x[0].script_uid +
                ' - ' +
                x[0].version +
                ' - ' +
                x[0].script_defination
        );
    }

    getScriptSql(script: string) {
        // console.log(script);

        let x = this.script.filter((ele) => {
            return (
                ele.script_uid +
                    ' - ' +
                    ele.version +
                    ' - ' +
                    ele.script_defination ==
                script
            );
        });

        return x[0].script_sql;
    }

    getPrestoSql(script: string) {
        let x = this.script.filter((ele) => {
            return (
                ele.script_uid +
                    ' - ' +
                    ele.version +
                    ' - ' +
                    ele.script_defination ==
                script
            );
        });

        return x[0].script_presto;
    }

    getScriptVersionId(script: string) {
        //   console.log(script);
        //  console.log(this.script);

        let x = this.script.filter((ele) => {
            return (
                ele.script_uid +
                    ' - ' +
                    ele.version +
                    ' - ' +
                    ele.script_defination ==
                script
            );
        });

        return x[0].version_id;
    }

    getScriptVariable(script: string) {
        let x = this.script.filter((ele) => {
            return ele.script_defination == script;
        });

        return x[0].scriptVaribales;
    }

    filterAuditUniverse3(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.auditUniverse3.length; i++) {
            const ele = this.auditUniverse3[i];

            if (ele.au_level_3_desc == null) {
                filtered.push(ele.au_level_3_desc);
            } else if (
                ele.au_level_3_desc
                    .toString()
                    .toLowerCase()
                    .includes(query.toString().toLowerCase()) ||
                ele.au_level_3_uid
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1
            ) {
                filtered.push(ele.au_level_3_uid + ' - ' + ele.au_level_3_desc);
            }
        }

        this.filteredAuditUniverse3 = filtered;
    }

    getFrequencyCode(val: String) {
        let f = this.frequency.filter((res) => {
            return res.codeName == val;
        });
        return f[0]?.codeId;
    }

    getFrequency(id: number) {
        if (this.frequency) {
            let f = this.frequency.filter((res) => {
                return res.codeId == id;
            });
            return f[0]?.codeName || null;
        }
    }

    getAuditUniverseId(val: String) {
        let a = this.auditUniverse3.filter((res) => {
            return res.au_level_3_desc == val.split(' - ')[1];
        });
        return a[0].au_level_3_id;
    }

    getAuditUniverse(id: number) {
        let a = this.auditUniverse3.filter((res) => {
            return res.au_level_3_id == id;
        });
        return a[0].au_level_3_uid + ' - ' + a[0].au_level_3_desc;
    }

    exportResultToExcel() {
        //  debugger;
        const title = 'AuditReport';
        const header_1 = Object.keys(this.audits[0]);
        const header_2 = Object.keys(this.auditPSelection[0]);
        const header_3 = Object.keys(this.auditT[0]);
        const header_4 = Object.keys(this.auditTH[0]);

        const data = this.audits;
        const data2 = this.auditPSelection;
        const data3 = this.auditT;
        const data4 = this.auditTH;
        //Create a workbook with a worksheet
        let workbook = new Workbook();
        let worksheet_1 = workbook.addWorksheet('Audit');
        //let workbook = new Workbook();
        let worksheet_2 = workbook.addWorksheet('Audit Programs');

        let worksheet_3 = workbook.addWorksheet('Audit Test');

        let worksheet_4 = workbook.addWorksheet('Audit Test History');

        //Add Row and formatting
        // worksheet.mergeCells('C1', 'F4');
        // let titleRow = worksheet.getCell('C1');
        // titleRow.value = title;
        // titleRow.font = {
        //     name: 'Calibri',
        //     size: 16,
        //     underline: 'single',
        //     bold: true,
        //     color: { argb: '0085A3' },
        // };
        // titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

        // Date
        // worksheet.mergeCells('G1:H4');
        // let d = new Date();
        // let date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
        // let dateCell = worksheet.getCell('G1');
        // dateCell.value = date;
        // dateCell.font = {
        //     name: 'Calibri',
        //     size: 12,
        //     bold: true,
        // };
        // dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

        // //Add Image
        // let myLogoImage = workbook.addImage({
        //     base64: logo.imgBase64,
        //     extension: 'png',
        // });
        // worksheet.mergeCells('A1:B4');
        // worksheet.addImage(myLogoImage, 'A1:B4');

        //Blank Row
        // worksheet.addRow([]);

        //Adding Header Row
        let headerRow_1 = worksheet_1.addRow(header_1);
        headerRow_1.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '4167B8' },
                bgColor: { argb: '' },
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFF' },
                size: 12,
            };
        });

        let headerRow_2 = worksheet_2.addRow(header_2);
        headerRow_2.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '4167B8' },
                bgColor: { argb: '' },
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFF' },
                size: 12,
            };
        });

        let headerRow_3 = worksheet_3.addRow(header_3);
        headerRow_3.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '4167B8' },
                bgColor: { argb: '' },
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFF' },
                size: 12,
            };
        });

        let headerRow_4 = worksheet_4.addRow(header_4);
        headerRow_4.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '4167B8' },
                bgColor: { argb: '' },
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFF' },
                size: 12,
            };
        });

        // Adding Data with Conditional Formatting
        data.forEach((d) => {
            let row = worksheet_1.addRow(Object.values(d));

            // let sales = row.getCell(6);
            // let color = 'FF99FF99';
            // if (+sales.value < 200000) {
            //     color = 'FF9999';
            // }

            // sales.fill = {
            //     type: 'pattern',
            //     pattern: 'solid',
            //     fgColor: { argb: color },
            // };
        });

        worksheet_1.getColumn(3).width = 20;
        worksheet_1.addRow([]);

        data2.forEach((d) => {
            let row = worksheet_2.addRow(Object.values(d));

            // let sales = row.getCell(6);
            // let color = 'FF99FF99';
            // if (+sales.value < 200000) {
            //     color = 'FF9999';
            // }

            // sales.fill = {
            //     type: 'pattern',
            //     pattern: 'solid',
            //     fgColor: { argb: color },
            // };
        });

        worksheet_2.getColumn(3).width = 20;
        worksheet_2.addRow([]);

        data3.forEach((d) => {
            let row = worksheet_3.addRow(Object.values(d));

            // let sales = row.getCell(6);
            // let color = 'FF99FF99';
            // if (+sales.value < 200000) {
            //     color = 'FF9999';
            // }

            // sales.fill = {
            //     type: 'pattern',
            //     pattern: 'solid',
            //     fgColor: { argb: color },
            // };
        });

        worksheet_3.getColumn(3).width = 20;
        worksheet_3.addRow([]);

        data4.forEach((d) => {
            let row = worksheet_4.addRow(Object.values(d));

            // let sales = row.getCell(6);
            // let color = 'FF99FF99';
            // if (+sales.value < 200000) {
            //     color = 'FF9999';
            // }

            // sales.fill = {
            //     type: 'pattern',
            //     pattern: 'solid',
            //     fgColor: { argb: color },
            // };
        });

        worksheet_4.getColumn(3).width = 20;
        worksheet_4.addRow([]);

        // //Footer Row
        // let footerRow = worksheet.addRow([
        //     'Employee Sales Report Generated from example.com at ' + date,
        // ]);
        // footerRow.getCell(1).fill = {
        //     type: 'pattern',
        //     pattern: 'solid',
        //     fgColor: { argb: 'FFB050' },
        // };

        //Merge Cells
        // worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

        //Generate & Save Excel File
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            fs.saveAs(
                blob,
                title +
                    '-' +
                    formatDate(
                        this.datetime,
                        'ddMMyyyyhh:mm:ss',
                        'en-US',
                        '+0530'
                    ) +
                    '.xlsx'
            );
        });
    }

    downloadExcel() {
        this.confirmationService.confirm({
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            message: 'Downloading will take time. Do you want to continue?',
            accept: () => {
                this.exportResultToExcelnew();
            },
        });
    }

    async exportResultToExcelnew() {
        this.loadingF = true;
        const dataaudits = this.audits;
        const dataprogram = this.auditPSelection;
        const datatest = this.auditTSelection;
        // const data4testhistory = this.auditTHSelection;
        let strexcel = '';

        // this.checktargettable()
        //   if (this.checktargettables == 1) {
        // debugger;
        // error: [];

        //   this.auditTexcel = [];
        //  for (var i = 0; i < this.auditPSelection.length; i++) {
        //     setTimeout(() => {
        //         this.auditService
        //             .getExcelTestHistoryresult(
        //                 0,
        //                 this.auditPSelection[i].audit_program_id
        //             )
        //             .subscribe({
        //                 next: (data) => {
        //                     this.auditTexcel = data.data;
        //                     console.log(data.data);
        //                 },
        //                 error: (e) => console.error(e),
        //             });
        //     }, 1000);

        // await this.auditService
        //     .getExcelTestHistoryresult(
        //         0,
        //         this.auditPSelection[i].audit_program_id
        //     )
        //     .subscribe((result: any) => {
        //         // console.log("audituniverse");
        //         // console.log(result);
        //         // this.auditTexcel = result.data.data;

        //         if (result.data.data.length > 0)
        //             this.auditTexcel.push(result.data.data);
        //         // console.log(this.auditTexcel);
        //     });

        //  this.getexce(this.auditPSelection[i].audit_program_id);
        // this.getEmpData(this.auditPSelection[i].audit_program_id);
        // this.auditService
        //     .getExcelTestHistoryresult(
        //         0,
        //         this.auditPSelection[i].audit_program_id
        //     )
        //     .subscribe((data: any[]) => {
        //         console.log(data);
        //         this.auditTexcel = data;
        //     });

        // debugger;
        for (var i = 0; i < dataprogram.length; i++) {
            // this.auditTexcel =
            //     await this.auditService.getExcelTestHistoryresult(
            //         0,
            //         dataprogram[i].audit_program_id
            //     );
            if (datatest.length > 0) {
                //    debugger;
                // console.log(data2);

                const title = 'AuditReport';

                //  const header_1 = Object.keys(this.aduitsres[0]);
                const data = dataaudits;

                let workbook = new Workbook();
                let worksheet_1 = workbook.addWorksheet(
                    dataaudits[0].audit_uid + ' - Audit'
                );

                /*Column headers*/
                worksheet_1.getRow(1).values = [
                    'Audit_ID',
                    'AB_ID',
                    'Audit_Name',
                    'BU_ID',
                    'AU_ID',
                    'Review_Year',
                    'Quarter',
                    'Start_Date',
                    'End_Date',
                    'Created_by',
                    'ACP_Audit',
                    'Last_Run',
                ];

                /*Define your column keys because this is what you use to insert your data according to your columns, they're column A, B, C, D respectively being idClient, Name, Tel, and Adresse.
    So, it's pretty straight forward */
                worksheet_1.columns = [
                    { key: 'Audit_ID', width: 20 },
                    { key: 'AB_ID', width: 25 },
                    { key: 'Audit_Name', width: 25 },
                    { key: 'BU_ID', width: 20 },
                    { key: 'AU_ID', width: 20 },
                    { key: 'Review_Year', width: 25 },
                    { key: 'Quarter', width: 20 },
                    { key: 'Start_Date', width: 25 },
                    { key: 'End_Date', width: 25 },
                    { key: 'Created_by', width: 25 },
                    { key: 'ACP_Audit', width: 25 },
                    { key: 'Last_Run', width: 25 },
                ];

                [
                    'A1',
                    'B1',
                    'C1',
                    'D1',
                    'E1',
                    'F1',
                    'G1',
                    'H1',
                    'I1',
                    'J1',
                    'K1',
                    'L1',
                ].map((key) => {
                    worksheet_1.getCell(key).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '5B9BD5' },
                    };
                    worksheet_1.getCell(key).alignment = {
                        vertical: 'top',
                        horizontal: 'left',
                        wrapText: true,
                    };
                });
                data.forEach(function (item, index) {
                    worksheet_1.addRow({
                        Audit_ID: item.audit_id,
                        AB_ID: item.audit_board_id,
                        Audit_Name: item.audit_name,
                        BU_ID: item.banner,
                        AU_ID: item.au_level_2_desc,
                        Review_Year: item.review_year,
                        Quarter: item.quarter,
                        Start_Date: item.start_date,
                        End_Date: item.end_date,
                        Created_by: item.full_name,
                        ACP_Audit: item.acp_audit,
                        Last_Run: item.last_run_date,
                    });
                });

                worksheet_1.eachRow(function (Row, rowNum) {
                    Row.eachCell(function (Cell, cellNum) {
                        if (rowNum == 1) {
                            Cell.alignment = {
                                vertical: 'top',
                                horizontal: 'left',
                                wrapText: true,
                            };
                        } else {
                            Cell.alignment = {
                                vertical: 'top',
                                horizontal: 'left',
                                wrapText: true,
                            };
                        }
                    });
                });

                const data1 = dataprogram[i];
                const data2 = datatest.filter(
                    (x) => x.ap_id == dataprogram[i].audit_program_id
                );
                //   debugger;
                const data4testhistory = this.auditTHSelection.filter(
                    (x) =>
                        x.ap_id == dataprogram[i].audit_program_id &&
                        x.job_run_status == 5
                );

                //   workbook = new Workbook();
                let worksheet_2 = workbook.addWorksheet(
                    data1.audit_program_uid + '- Audit Programs'
                );

                /*Column headers*/
                worksheet_2.getRow(1).values = [
                    'AP_ID',
                    'AP_Name',
                    'AP_Desc',
                    'AU_ID',
                    'Last_Run',
                ];

                /*Define your column keys because this is what you use to insert your data1 according to your columns, they're column A, B, C, D respectively being idClient, Name, Tel, and Adresse.
    So, it's pretty straight forward */
                worksheet_2.columns = [
                    { key: 'AP_ID', width: 20 },
                    { key: 'AP_Name', width: 25 },
                    { key: 'AP_Desc', width: 25 },
                    { key: 'AU_ID', width: 25 },
                    { key: 'Last_Run', width: 25 },
                ];

                ['A1', 'B1', 'C1', 'D1', 'E1'].map((key) => {
                    worksheet_2.getCell(key).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '5B9BD5' },
                    };
                    worksheet_2.getCell(key).alignment = {
                        vertical: 'top',
                        horizontal: 'left',
                        wrapText: true,
                    };
                });
                // data1.forEach(function (item, index) {
                worksheet_2.addRow({
                    AP_ID: data1.audit_program_uid,
                    AP_Name: data1.ap_name,
                    AP_Desc: data1.ap_desc,
                    AU_ID: data1.au_level_3_desc,
                    Last_Run: data1.last_run,
                });

                worksheet_2.eachRow(function (Row, rowNum) {
                    Row.eachCell(function (Cell, cellNum) {
                        if (rowNum == 1) {
                            Cell.alignment = {
                                vertical: 'top',
                                horizontal: 'left',
                                wrapText: true,
                            };
                        } else {
                            Cell.alignment = {
                                vertical: 'top',
                                horizontal: 'left',
                                wrapText: true,
                            };
                        }
                    });
                });
                // });

                // let worksheet_3 = workbook.addWorksheet(
                //     data1[i].audit_program_uid +
                //         ' - Audit Test - ' +
                //         data1[i].ap_name
                // );
                let worksheet_3 = workbook.addWorksheet('Audit Test');

                /*Column headers*/
                worksheet_3.getRow(1).values = [
                    'AuditTest_ID',
                    'AuditTest_Desc',
                    'Risk_ID',
                    'Risk_Desc',
                    'Control_ID',
                    'Control_Desc',
                    'Script_ID',
                    'Script_Desc',
                    //  'Script_SQL',
                    'Results',
                    'Notes',
                    'audit_run_status',
                    'audit_history_uid',
                    'results_url',
                ];

                /*Define your column keys because this is what you use to insert your data2 according to your columns, they're column A, B, C, D respectively being idClient, Name, Tel, and Adresse.
    So, it's pretty straight forward */
                worksheet_3.columns = [
                    { key: 'AuditTest_ID', width: 20 },
                    { key: 'AuditTest_Desc', width: 25 },
                    { key: 'Risk_ID', width: 20 },
                    { key: 'Risk_Desc', width: 25 },
                    { key: 'Control_ID', width: 20 },
                    { key: 'Control_Desc', width: 25 },
                    { key: 'Script_ID', width: 20 },
                    { key: 'Script_Desc', width: 25 },
                    //  { key: 'Script_SQL', width: 100 },
                    { key: 'Results', width: 25 },
                    { key: 'Notes', width: 25 },
                    { key: 'audit_run_status_text', width: 25 },
                    { key: 'audit_history_uid', width: 25 },
                    { key: 'Results_url', width: 25 },
                ];

                [
                    'A1',
                    'B1',
                    'C1',
                    'D1',
                    'E1',
                    'F1',
                    'G1',
                    'H1',
                    'I1',
                    'J1',
                    'K1',
                    'L1',
                    'M1',
                ].map((key) => {
                    worksheet_3.getCell(key).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '5B9BD5' },
                    };
                    worksheet_3.getCell(key).alignment = {
                        vertical: 'top',
                        horizontal: 'left',
                        wrapText: true,
                    };
                });

                //     setTimeout(() => {
                data4testhistory.forEach((item) => {
                    // console.log(item);

                    worksheet_3.addRow({
                        AuditTest_ID: item.audit_test_uid,
                        AuditTest_Desc: item.audit_test_desc,
                        Risk_ID: item.risk_uid,
                        Risk_Desc: item.audit_risk,
                        Control_ID: item.control_uid,
                        Control_Desc: item.control,
                        Script_ID: item.script_uid,
                        Script_Desc: item.script_defination,
                        // Script_SQL: item.athscript_sql,
                        Results: item.results,
                        Notes: item.notes,
                        audit_run_status_text: item.audit_run_status_text,
                        audit_history_uid: item.audit_history_uid,
                        // Results_url: {
                        //     text: item.target_table,
                        //     hyperlink: '#' + item.target_table + '!A1',
                        // },
                        Results_url:
                            item.target_table != null
                                ? {
                                      text: item.target_table,
                                      hyperlink:
                                          '#' + item.target_table + '!A1',
                                  }
                                : '',
                    });

                    // // worksheet_3.getCell('K' + this.count).value = {
                    // //     text: item.target_table,
                    // //     hyperlink: '#' + item.target_table + '!A1',
                    // // };
                    // worksheet_3.getCell('K' + this.count).value = {
                    //     text: item.target_table,
                    //     hyperlink: '#' + item.target_table + '!A1',
                    // };
                    // this.count++;
                });

                worksheet_3.eachRow(function (Row, rowNum) {
                    Row.eachCell(function (Cell, cellNum) {
                        if (rowNum == 1) {
                            Cell.alignment = {
                                vertical: 'top',
                                horizontal: 'left',
                                wrapText: true,
                            };
                        } else {
                            Cell.alignment = {
                                vertical: 'top',
                                horizontal: 'left',
                                wrapText: true,
                            };
                        }
                    });
                });
                // let x = [];
                // for (var iii = 0; iii < data4testhistory.length; iii++) {
                //     //    debugger;
                //     // const worksheet_5 = '';
                //     // this.checktargettable(data2[i].target_table);
                //     x.push('wwwwww');
                //     let finalcall;
                //     if (x.indexOf(data4testhistory[iii].target_table) !== -1) {
                //         // //    alert('Value exists!');
                //         finalcall = 'YES';
                //     } else {
                //         finalcall = 'NO';
                //     }
                //     //else {
                //     // alert('Value does not exists!');
                //     strexcel = data4testhistory[iii].audit_history_uid;

                //     x.push(data2[iii].target_table);
                //     this.checktargettables =
                //         await this.auditService.checktargettablenew(
                //             data4testhistory[iii].target_table
                //         );
                //     if (this.checktargettables.data == 1) {
                //         this.targettablesnew =
                //             await this.auditService.TargetTbladh(
                //                 data4testhistory[iii].target_table,
                //                 data4testhistory[iii].audit_history_uid
                //             );
                //         const header_5 =
                //             this.targettablesnew.data.length > 0
                //                 ? Object.keys(this.targettablesnew.data[0])
                //                 : '';

                //         const data5 =
                //             this.targettablesnew.data.length > 0
                //                 ? this.targettablesnew.data
                //                 : [];
                //         let worksheet_5;
                //         if (finalcall == 'NO') {
                //             worksheet_5 = workbook.addWorksheet(
                //                 data4testhistory[iii].target_table
                //             );
                //         }

                //         if (this.targettablesnew.data.length > 0) {
                //             if (finalcall == 'NO') {
                //                 let headerRow_5 = worksheet_5.addRow(header_5);
                //                 headerRow_5.eachCell((cell, number) => {
                //                     cell.fill = {
                //                         type: 'pattern',
                //                         pattern: 'solid',
                //                         fgColor: { argb: '4167B8' },
                //                         bgColor: { argb: '' },
                //                     };
                //                     cell.font = {
                //                         bold: true,
                //                         color: { argb: 'FFFFFF' },
                //                         size: 12,
                //                     };
                //                 });
                //             }
                //         }

                //         if (this.targettablesnew.data.length > 0) {
                //             data5.forEach((d) => {
                //                 let row = worksheet_5.addRow(Object.values(d));

                //                 // let sales = row.getCell(6);
                //                 // let color = 'FF99FF99';
                //                 // if (+sales.value < 200000) {
                //                 //     color = 'FF9999';
                //                 // }

                //                 // sales.fill = {
                //                 //     type: 'pattern',
                //                 //     pattern: 'solid',
                //                 //     fgColor: { argb: color },
                //                 // };
                //             });

                //             worksheet_5.getColumn(3).width = 20;
                //             worksheet_5.addRow([]);
                //         }
                //     }
                //     // }
                // }
                //   debugger;
                for (var ti = 0; ti < data2.length; ti++) {
                    if (
                        data2[ti].target_table != '' &&
                        data2[ti].target_table != null
                    ) {
                        const datatarget = data4testhistory.filter(
                            (x) => x.target_table == data2[ti].target_table
                        );

                        this.checktargettables =
                            await this.auditService.checktargettablenew(
                                data2[ti].target_table
                            );
                        if (this.checktargettables.data == 1) {
                            let worksheet_5 = workbook.addWorksheet(
                                data2[ti].target_table
                            );

                            let x = [];
                            for (var to = 0; to < datatarget.length; to++) {
                                this.targettablesnew =
                                    await this.auditService.TargetTbladh(
                                        datatarget[to].target_table,
                                        datatarget[to].audit_history_uid
                                    );
                                //  x.push(this.targettablesnew.data);
                                const header_5 =
                                    this.targettablesnew.data.length > 0
                                        ? Object.keys(
                                              this.targettablesnew.data[0]
                                          )
                                        : '';
                                if (to == 0) {
                                    let headerRow_5 =
                                        worksheet_5.addRow(header_5);
                                    headerRow_5.eachCell((cell, number) => {
                                        cell.fill = {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: '4167B8' },
                                            bgColor: { argb: '' },
                                        };
                                        cell.font = {
                                            bold: true,
                                            color: { argb: 'FFFFFF' },
                                            size: 12,
                                        };
                                    });
                                }

                                const data5 =
                                    this.targettablesnew.data.length > 0
                                        ? this.targettablesnew.data
                                        : [];
                                data5.forEach((d) => {
                                    let row = worksheet_5.addRow(
                                        Object.values(d)
                                    );
                                });

                                worksheet_5.getColumn(3).width = 30;
                                worksheet_5.eachRow(function (Row, rowNum) {
                                    Row.eachCell(function (Cell, cellNum) {
                                        if (rowNum == 1) {
                                            Cell.alignment = {
                                                vertical: 'top',
                                                horizontal: 'left',
                                                wrapText: true,
                                            };
                                        } else {
                                            Cell.alignment = {
                                                vertical: 'top',
                                                horizontal: 'left',
                                                wrapText: true,
                                            };
                                        }
                                    });
                                });
                                //  worksheet_5.addRow([]);
                            }
                        }
                    }
                }

                const ff = this.arrData;
                this.checktt = [];
                if (data4testhistory.length > 0) {
                    workbook.xlsx.writeBuffer().then((data) => {
                        let blob = new Blob([data], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        });
                        fs.saveAs(
                            blob,
                            title +
                                '-' +
                                formatDate(
                                    this.datetime,
                                    'ddMMyyyyhh:mm:ss',
                                    'en-US',
                                    '+0530'
                                ) +
                                '-' +
                                i +
                                '.xlsx'
                        );
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!!',
                        detail: 'Data Does not Exist !!',
                        life: 3000,
                    });
                }
            }
        }
        //   }, 5000);
        //  }
        // } else {
        //     this.messageService.add({
        //         severity: 'error',
        //         summary: 'ERROR!!',
        //         detail: 'Target Table Does not Exist !!',
        //         life: 3000,
        //     });
        // }
        this.loadingF = false;
    }

    getaudit(id: number) {
        this.auditService
            .sendGetauditRequest(id)
            .pipe(
                map((resp) => resp.data),
                catchError((err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!!',
                        detail: 'Something Went Wrong !!',
                        life: 3000,
                    });
                    // console.log(err);
                    return throwError(err);
                }),
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe((res) => {
                res.map((res) => {
                    res.record_status == 0
                        ? (res.record_status = false)
                        : (res.record_status = true);
                    return res;
                });
                //  debugger;
                this.audits = res;
                const flagcom =
                    this.audits[0].user_access_id.indexOf(',') != -1;
                // flagcom == false &&
                const hasname =
                    this.audits[0].useracsname.indexOf(this.givenname) != -1;
                if (
                    (this.rolename.replace(/\s/g, '') == 'Manger' ||
                        this.rolename.replace(/\s/g, '') == 'Auditor' ||
                        this.rolename.replace(/\s/g, '') == 'Manager') &&
                    this.givenname != this.audits[0].full_name &&
                    hasname == false &&
                    this.useraccessn == 'yes' &&
                    this.acp_audit == 'false'
                ) {
                    this.isButtonVisible = false;
                } else {
                    this.isButtonVisible = true;
                }
                let aud =
                    this.auditUniverseService.getAuditUniverseLevel3_audit(
                        this.audits[0].au_level_2_id
                    );
                let freq = this.auditService.getFrequency();
                let scr = this.scriptService.getScript(0);

                forkJoin([aud, freq, scr]).subscribe((results: any) => {
                    this.auditUniverse3 = results[0].data.data;
                    this.frequency = results[1].data;
                    this.script = results[2].data;

                    this.filteredFrequency = this.frequency.map((res) => {
                        return res.codeName;
                    });
                });
            });
    }

    popupHeader;

    getText(val, _formGroup: FormGroup, _formControlName, title) {
        this.popupHeader = title;
        this.textDialogForm = this._formbuilder.group({
            input: val,
        });
        this.showPopupText = true;
        this.popupText = val;
        this.textDialog.onHide.subscribe(() => {
            _formGroup
                ?.get(_formControlName)
                ?.setValue(this.textDialogForm.get('input').value);
            _formGroup = null;
            _formControlName = null;
        });
    }

    getBanner(id: number) {
        let x = this.banner.filter((ele) => {
            return ele.department_id == id;
        });
        return x[0].department_uid + ' - ' + x[0].department;
    }

    getBannerId(val: string) {
        let x = this.banner.filter((ele) => {
            return ele.department_uid + ' - ' + ele.department == val;
        });
        return x[0].department_id;
    }

    backClicked() {
        this._location.back();
    }

    getLocalDateTime(time: Date) {
        if (time == null) {
            return new Date(
                this.today.getFullYear(),
                this.today.getMonth(),
                this.today.getDate(),
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

    getTwoDigit(val) {
        return ('0' + val).slice(-2);
    }

    storeOption = ['Yes', 'No'];
    scriptDefaultVariables = [
        '$AuditTestHistoryID',
        '$AuditTestID',
        '$RiskID',
        '$ControlID',
        '$ScriptID',
        '$Banner',
    ];

    // export to excel new
}
