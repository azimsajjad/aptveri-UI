import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, forkJoin, throwError } from 'rxjs';
import { AuditProgram } from 'src/app/api/roboticsAudit/audit-program';
import { AuditService } from 'src/app/service/audit.service';
import { BannerService } from 'src/app/service/librariesservice';
import { ScriptService } from 'src/app/service/scriptservices';
import { Banner, Organisation } from 'src/app/api/libraries';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class TestComponent implements OnInit, OnChanges {
    @Input() auditProgram: AuditProgram[];
    @Output() auditTestSelection = new EventEmitter<any>();

    showTable: boolean = true;
    loading: boolean = true;

    auditTest;
    auditTSelection;
    scriptSelection;

    script;
    filteredScript;
    department;
    filteredDepartment;
    risk;
    filteredRisk;
    control;
    filteredControl;
    auditUniverse4;
    filteredAuditUniverse4;
    allOrg;
    filteredOrg;

    auditTestForm: FormGroup;

    loadingRisk: boolean = false;
    loadingControl: boolean = false;
    loadingScript: boolean = false;

    noScript: boolean = false;

    isRiskEnable: boolean = true;
    isControlEnable: boolean = true;
    isScriptEnable: boolean = true;
    rolename;
    givenname;

    constructor(
        private auditService: AuditService,
        private _formbuilder: FormBuilder,
        private scriptService: ScriptService,
        private libraryService: BannerService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        const token = localStorage.getItem('jwt');
        this.rolename = JSON.parse(
            window.atob(localStorage.getItem('jwt').split('.')[1])
        )['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        this.givenname = JSON.parse(
            window.atob(localStorage.getItem('jwt').split('.')[1])
        )['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];
        let scr = this.scriptService.getScript(0);
        let dept = this.auditService.sendGetBannerRequest();
        let aRisk = this.libraryService.sendGetriskRequest();
        let aControl = this.libraryService.sendGetcontrolRequest();
        let organiz = this.libraryService.getAllOrganizations();
        // this.libraryService.getAllOrganizations().subscribe((res) => {
        //     this.allOrg = res.data;
        // });
        forkJoin([scr, dept, aRisk, aControl, organiz]).subscribe(
            (results: any) => {
                this.script = results[0].data;
                this.department = results[1].data;
                this.risk = results[2].data;
                this.control = results[3].data;
                this.allOrg = results[4].data;
            }
        );
    }

    openT(auditTest) {
        this.isRiskEnable = true;
        this.isControlEnable = true;
        this.isScriptEnable = true;

        this.auditTestForm = this._formbuilder.group({
            audit_test_id: auditTest?.audit_test_id || null,
            audit_test_desc: [
                auditTest ? auditTest.audit_test_desc : null,
                Validators.required,
            ],
            // organization_id: auditTest
            //     ? this.getOrganization(auditTest?.organization_id)
            //     : null,

            organization_id: this.getOrganization(
                auditTest
                    ? auditTest.organization_id
                    : this.auditProgram[0].organization_id
            ),
            department_id: this.getDepartment(
                auditTest
                    ? auditTest.department_id
                    : this.auditProgram[0].department_id
            ),
            // department_id: auditTest
            //     ? this.getDepartment(auditTest?.department_id)
            //     : null,
            ap_id: this.auditProgram[0].audit_program_id,
            risk_id: [
                auditTest ? this.getRisk(auditTest.risk_id) : null,
                Validators.required,
            ],
            control_id: [
                auditTest ? this.getControl(auditTest.control_id) : null,
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

        this.auditTestForm.get('control_id').valueChanges.subscribe((res) => {
            if (res == '' || res == null) {
                this.isScriptEnable = true;
            } else {
                this.isScriptEnable = false;
            }
        });

        this.showTable = false;
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

    auditTestFormSubmit() {
        debugger;
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

        this.auditTestForm
            .get('au_level_4_id')
            .setValue(
                this.getAuditUniversel4Id(
                    this.auditTestForm.get('au_level_4_id').value
                )
            );
        this.auditTestForm
            .get('control_id')
            .setValue(
                this.getControlId(this.auditTestForm.get('control_id').value)
            );

        this.auditTestForm
            .get('organization_id')
            .setValue(
                this.getOrganizationtId(
                    this.auditTestForm.get('organization_id').value
                )
            );

        this.auditTestForm
            .get('department_id')
            .setValue(
                this.getDepartmentId(
                    this.auditTestForm.get('department_id').value
                )
            );
        this.auditTestForm
            .get('risk_id')
            .setValue(this.getRiskId(this.auditTestForm.get('risk_id').value));
        this.auditTestForm
            .get('script_id')
            .setValue(
                this.getScriptId(this.auditTestForm.get('script_id').value)
            );

        if (this.auditProgram[0].schedule_status) {
            this.auditTestForm.value.frequency =
                this.auditProgram[0].frequency_id;
            this.auditTestForm.value.schedule_start_datetime =
                this.auditProgram[0].ap_schedule_date;
            this.auditTestForm.value.schedule_end_datetime =
                this.auditProgram[0].next_run;
            this.auditTestForm.value.schedule_run_time =
                this.auditProgram[0].ap_schedule_time;
        } else {
            this.auditTestForm.value.frequency =
                this.auditProgram[0].frequency_id;
            this.auditTestForm.value.schedule_start_datetime = new Date();
            this.auditTestForm.value.schedule_end_datetime = new Date();
            this.auditTestForm.value.schedule_status = false;
        }
        console.log(this.auditTestForm.value);

        if (this.auditTestForm.get('audit_test_id').value == null) {
            // add
            debugger;
            if (this.auditProgram[0].schedule_status == false) {
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
                            this.showTable = true;
                            this.loading = false;
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
                            this.showTable = true;
                            this.loading = false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'New Audit Test Created !!',
                                life: 3000,
                            });
                            this.showTable = true;
                            this.getTests();
                        } else {
                            this.showTable = true;
                            this.loading = false;
                            this.messageService.add({
                                severity: 'info',
                                summary: 'INFO!!',
                                detail: res.message,
                                life: 3000,
                            });
                            this.showTable = true;
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
                            this.showTable = true;
                            this.loading = false;
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
                            this.showTable = true;
                            this.loading = false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'New Audit Scheduled Test Created !!',
                                life: 3000,
                            });
                            this.showTable = true;
                            this.getTests();
                        } else {
                            this.showTable = true;
                            this.loading = false;
                            this.messageService.add({
                                severity: 'info',
                                summary: 'INFO!!',
                                detail: res.message,
                                life: 3000,
                            });
                            this.showTable = true;
                            this.getTests();
                        }
                    });
            }
        } else {
            // edit
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
                        this.loading = false;
                        this.showTable = true;
                        return throwError(err);
                    }),
                    finalize(() => {
                        this.scriptService.getScript(0).subscribe((res) => {
                            this.script = res.data;
                        });
                    })
                )
                .subscribe((res: any) => {
                    if (res.data) {
                        this.showTable = true;
                        this.loading = false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Audit Program Edited !!',
                            life: 3000,
                        });
                        this.auditTSelection = null;
                        this.showTable = true;
                        this.getTests();
                    } else {
                        this.showTable = true;
                        this.loading = false;
                        this.messageService.add({
                            severity: 'info',
                            summary: 'INFO!!',
                            detail: res.message,
                            life: 3000,
                        });
                        this.auditTSelection = null;
                        this.showTable = true;
                        this.getTests();
                    }
                });
        }
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
                            this.loading = false;
                            return throwError(err);
                        })
                    )
                    .subscribe((res) => {
                        if (res.data) {
                            this.loading = false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Audit Test Deleted !!',
                                life: 3000,
                            });
                            this.getTests();
                            this.auditTSelection = null;
                        } else {
                            this.loading = false;
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
                    }),
                    finalize(() => {
                        this.auditTestSelection.emit(this.auditTSelection);
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

    ngOnChanges(): void {
        this.getTests();
    }

    getTests() {
        if (this.auditProgram?.length > 0) {
            let programId = [];
            let x = [];
            this.loading = true;
            this.auditProgram.forEach((ele) => {
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
                        // ele['banner_uid'] = this.banner?.filter((ele) => {
                        //     return ele.department_id == ele.department_id;
                        // })[0].banner_uid;
                        x.push(ele);
                        return ele;
                    });

                    if (index == programId.length - 1) {
                        this.auditTest = x;
                        this.auditTest.sort((a, b) => {
                            b.audit_test_id - a.audit_test_id;
                        });
                        this.loading = false;
                    }
                });
            });
            this.auditUniverse4 = this.auditService
                .getScriptUniLevel4(this.auditProgram[0]?.au_level_3_id)
                .subscribe((res) => {
                    this.auditUniverse4 = res.data;
                });
        }
    }

    selectTest() {
        this.auditTestSelection.emit(this.auditTSelection);
    }

    onAuditUniverse4Select(event) {
        this.loadingRisk = true;
        this.auditService
            .getScriptRisk(this.getAuditUniversel4Id(event))
            .subscribe((res) => {
                this.loadingRisk = false;
                this.risk = res.data;
                this.auditTestForm.get('risk_id').setValue(null);
                this.auditTestForm.get('control_id').setValue(null);
                this.auditTestForm.get('script_id').setValue(null);
                // this.scriptSelection = null;
            });
    }

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
                this.control = res.data;
                this.auditTestForm.get('control_id').setValue(null);
                this.auditTestForm.get('script_id').setValue(null);
                // this.scriptSelection = null;
            });
    }

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
                this.script = res.data;
                this.loadingScript = false;
                if (this.script.length == 0) {
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

    // filter
    filterDepartment(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.department.length; i++) {
            const ele = this.department[i];
            if (ele.department_uid == null) {
                filtered.push(ele.department_uid);
            } else if (
                ele.department_uid
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1 ||
                ele.department
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1
            ) {
                filtered.push(ele.department_uid + ' - ' + ele.department);
            }
            this.filteredDepartment = filtered;
        }
    }

    filterControl(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.control.length; i++) {
            const ele = this.control[i];
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

    filterScript(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.script.length; i++) {
            const ele = this.script[i];
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

    filterRisk(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.risk.length; i++) {
            const ele = this.risk[i];
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

    getDepartment(id: number) {
        debugger;
        let d = this.department.find((ele) => {
            return ele.department_id == id;
        });
        return d.department_uid + ' - ' + d.department;
    }

    getDepartmentId(val: string) {
        let x = this.department.filter((ele) => {
            return ele.department_uid + ' - ' + ele.department == val;
        });
        return x[0].department_id;
    }

    getScript(id: number) {
        let s = this.script.find((ele) => {
            return ele.script_id == id;
        });

        return (
            s['script_uid'] + ' - ' + s.version + ' - ' + s.script_defination
        );
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

    getAuditUniversel4Id(audit: string) {
        let x = this.auditUniverse4.find((ele) => {
            return ele.keyvalue == audit;
        });

        return x.keyid;
    }

    getAuditUniverse4(id: number) {
        let x = this.auditUniverse4.filter((ele) => {
            return ele.keyid == id;
        });

        return x[0].keyvalue;
    }

    getRiskId(risk: string): number {
        let x = this.risk.filter((ele) => {
            return (
                ele.keyuid == risk.split(' - ')[0] ||
                ele.risk_uid == risk.split(' - ')[0]
            );
        });

        return x[0].keyid || x[0].risk_id;
    }

    getRisk(id: number) {
        let r = this.risk.find((ele) => {
            return ele.risk_id == id;
        });
        return r.risk_uid + ' - ' + r.risk;
    }

    filterOrg(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.allOrg.length; i++) {
            const ele = this.allOrg[i];
            if (ele.organization_uid == null) {
                filtered.push(ele.organization_uid);
            } else if (
                ele.organization_uid
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1 ||
                ele.organization
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1
            ) {
                filtered.push(ele.organization_uid + ' - ' + ele.organization);
            }
            this.filteredOrg = filtered;
        }
    }

    getOrganization(id: number) {
        debugger;
        let x = this.allOrg.filter((ele) => {
            return ele.organization_id == id;
        });

        return x[0].organization_uid + ' - ' + x[0].organization;
    }

    getOrganizationtId(val: string) {
        let x = this.allOrg.filter((ele) => {
            return ele.organization_uid + ' - ' + ele.organization == val;
        });
        return x[0].organization_id;
    }

    getBanner(id: number) {
        let x = this.department.filter((ele) => {
            return ele.department_id == id;
        });
        return x[0].department_uid + ' - ' + x[0].department;
    }

    getBannerId(val: string) {
        let x = this.department.filter((ele) => {
            return ele.department_uid + ' - ' + ele.department == val;
        });
        return x[0].department_id;
    }

    getControlId(control: string): number {
        let x = this.control.filter((ele) => {
            return (
                ele.keyuid + ' - ' + ele.keyvalue == control ||
                ele.control_uid + ' - ' + ele.control
            );
        });

        return x[0].keyid || x[0].control_id;
    }

    getControl(id: number) {
        let c = this.control.find((ele) => {
            return ele.control_id == id;
        });

        return c.control_uid + ' - ' + c.control;
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
}
