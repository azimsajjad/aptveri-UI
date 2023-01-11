import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { Table } from 'primeng/table';
import { title } from 'process';
import {
    catchError,
    combineLatest,
    debounceTime,
    finalize,
    forkJoin,
    map,
    throwError,
} from 'rxjs';
import { Script } from 'src/app/api/libraries';
import { AuditUniverseService } from 'src/app/service/audituniverseservice';
import { BannerService } from 'src/app/service/librariesservice';
import { ScriptService } from 'src/app/service/scriptservices';
import { AuthService } from '../../../service/auth.service';
@Component({
    selector: 'app-script-detail',
    templateUrl: './script-detail.component.html',
    styleUrls: ['./script-detail.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class ScriptDetailComponent implements OnInit {
    loading: boolean = true;
    scriptDialog: boolean = false;
    showScriptPop: boolean = false;
    showScriptPopTitle;
    scirptError: boolean = false;
    scriptForm: FormGroup;
    scriptEditMode: string;
    selectedScript;
    scriptVariables: string[];
    storeScriptVariables;
    changePrestoScript: boolean = true;
    changeSqlScript: boolean = true;
    showPopupText: boolean = false;
    textDialogForm: FormGroup;
    popupText;
    profiles;
    showTable: boolean = true;

    @ViewChild('textDialog') textDialog: Dialog;

    banner: any;
    filteredBanner: any;
    risk: any;
    filteredRisk: any;
    control: any;
    filteredControl: any;
    audit: any;
    filteredAudit: any;
    showScriptContent;

    script: Script;

    filteredData: any[];
    filteredDay: any[];
    filteredDatatypes: any[];

    @ViewChild('dt1') table: Table;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild('submitButton') submitButton: ElementRef;

    re = /[$][A-Za-z0-9_]+/g;
    today = new Date();

    constructor(
        private _formbuilder: FormBuilder,
        private messageService: MessageService,
        private scriptService: ScriptService,
        private bannerService: BannerService,
        private auditUniverseService: AuditUniverseService,
        public accountSvr: AuthService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.getScript();

        let ban = this.bannerService.sendGetRequest();
        let ri = this.bannerService.sendGetriskRequest();
        let cont = this.bannerService.sendGetcontrolRequest();
        let aud = this.auditUniverseService.getAuditUniverseLevel4Script(0);
        let pro = this.scriptService.getProfiles();

        forkJoin([ban, ri, cont, aud, pro]).subscribe((results: any) => {
            this.banner = results[0].data;
            this.risk = results[1].data;
            this.control = results[2].data;
            this.audit = results[3].data.data;
            this.profiles = results[4].data;
            this.loading = false;
        });
    }

    getScript() {
        this.scriptService
            .getScript(0)
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
                this.script = res;
            });
    }

    openNew(script: Script, type: string) {
        this.showTable = false;
        this.scriptEditMode = type;

        if (this.scriptEditMode == 'edit') {
            this.storeScriptVariables = script.scriptVaribales;

            this.scriptForm = this._formbuilder.group({
                record_id: script.record_id,
                script_id: script.script_id,
                version_id: script.version_id,
                version: script.version,
                original_version_id: script.original_version_id,
                control_id: [
                    this.getControlDesc(script.control_id),
                    Validators.required,
                ],
                risk_id: [
                    this.getRiskDesc(script.risk_id),
                    Validators.required,
                ],
                au_id: [
                    this.getAuditDesc(script.au_level_4_id),
                    Validators.required,
                ],
                banner_id: [
                    this.getBannerDesc(script.department_id),
                    Validators.required,
                ],
                sql_script: script.script_sql,
                script_presto: script.script_presto,
                sql_definition: [script.script_defination, Validators.required],
                target_table: [script.target_table],
                schedule_day: script.schedule_day,
                start_time_interval: new Date(
                    this.today.getFullYear(),
                    this.today.getMonth(),
                    this.today.getDate(),
                    script.start_time_interval / 100,
                    script.start_time_interval % 100
                ),
                start_time_interval_end: new Date(
                    this.today.getFullYear(),
                    this.today.getMonth(),
                    this.today.getDate(),
                    script.start_time_interval_end / 100,
                    script.start_time_interval_end % 100
                ),
                schedule_status: script.schedule_status,
                role_access: [
                    script.role_access.split(',').map((ele) => {
                        return +ele;
                    }),
                ],
                variable: this._formbuilder.array(
                    script.scriptVaribales.map((scriptvar) => {
                        return this._formbuilder.group({
                            var_name: scriptvar.var_name,
                            var_datatype: [
                                scriptvar.var_datatype,
                                Validators.required,
                            ],
                        });
                    })
                ),
                record_status: script.record_status,
            });
        } else if (this.scriptEditMode == 'new') {
            this.storeScriptVariables = [];
            this.scriptForm = this._formbuilder.group({
                au_id: [null, Validators.required],
                risk_id: [null, Validators.required],
                banner_id: [null, Validators.required],
                control_id: [null, Validators.required],
                sql_script: null,
                script_presto: null,
                sql_definition: [null, Validators.required],
                target_table: [null],
                schedule_day: null,
                start_time_interval: new Date(
                    this.today.getFullYear(),
                    this.today.getMonth(),
                    this.today.getDate(),
                    0,
                    0,
                    0
                ),
                role_access: null,
                start_time_interval_end: new Date(
                    this.today.getFullYear(),
                    this.today.getMonth(),
                    this.today.getDate(),
                    0,
                    0,
                    0
                ),
                variable: this._formbuilder.array([]),
            });
        } else {
            this.storeScriptVariables = script.scriptVaribales;
            this.scriptForm = this._formbuilder.group({
                script_id: script.script_id,
                version_id: script.version_id,
                control_id: [
                    this.getControlDesc(script.control_id),
                    Validators.required,
                ],
                risk_id: [
                    this.getRiskDesc(script.risk_id),
                    Validators.required,
                ],
                au_id: [
                    this.getAuditDesc(script.au_level_4_id),
                    Validators.required,
                ],
                banner_id: [
                    this.getBannerDesc(script.department_id),
                    Validators.required,
                ],
                sql_script: script.script_sql,
                script_presto: script.script_presto,
                sql_definition: [script.script_defination, Validators.required],
                target_table: [script.target_table],
                schedule_day: script.schedule_day,
                schedule_status: script.schedule_status,
                output_only: script.output_only,
                start_time_interval: new Date(script.start_time_interval),
                start_time_interval_end: new Date(
                    script.start_time_interval_end
                ),
                role_access: [
                    script.role_access.split(',').map((ele) => {
                        return +ele;
                    }),
                ],
                record_status: 1,
                variable: this._formbuilder.array(
                    script.scriptVaribales.map((scriptvar) => {
                        return this._formbuilder.group({
                            var_name: scriptvar.var_name,
                            var_datatype: [
                                scriptvar.var_datatype,
                                Validators.required,
                            ],
                        });
                    })
                ),
            });
        }

        let a = this.scriptForm
            .get('sql_script')
            .valueChanges.pipe(debounceTime(100));

        let b = this.scriptForm
            .get('script_presto')
            .valueChanges.pipe(debounceTime(100));

        a.subscribe(() => {
            if (this.changePrestoScript) {
                this.scriptForm.get('script_presto').value == null
                    ? this.scriptForm.get('script_presto').setValue(' ')
                    : this.scriptForm
                          .get('script_presto')
                          .setValue(
                              this.scriptForm.get('script_presto').value + ' '
                          );
                this.changePrestoScript = false;
            }
        });

        b.subscribe(() => {
            if (this.changeSqlScript) {
                this.scriptForm.get('sql_script').value == null
                    ? this.scriptForm.get('sql_script').setValue(' ')
                    : this.scriptForm
                          .get('sql_script')
                          .setValue(
                              this.scriptForm.get('sql_script').value + ' '
                          );
                this.changeSqlScript = false;
            }
        });

        combineLatest([a, b]).subscribe((res) => {
            let match = [
                ...res[0].matchAll(this.re),
                ...res[1].matchAll(this.re),
            ];
            (<FormArray>this.scriptForm.get('variable')).clear();
            this.scriptVariables = [];
            if (match.length > 0) {
                match.forEach((element) => {
                    if (
                        this.scriptVariables.indexOf(element[0]) === -1 &&
                        '$Banner'.indexOf(element[0]) === -1
                    ) {
                        this.scriptVariables.push(element[0]);

                        (<FormArray>this.scriptForm.get('variable')).push(
                            this._formbuilder.group({
                                var_name: element[0],
                                var_datatype: [
                                    this.scriptDefaultVariables.includes(
                                        element[0]
                                    )
                                        ? 'int'
                                        : this.storeScriptVariables
                                              .map((x) => {
                                                  return x['var_name'];
                                              })
                                              .includes(element[0])
                                        ? this.storeScriptVariables
                                              .filter((x) => {
                                                  return (
                                                      x['var_name'] ==
                                                      element[0]
                                                  );
                                              })
                                              .map((x) => {
                                                  return x['var_datatype'];
                                              })
                                        : '',
                                    Validators.required,
                                ][0],
                            })
                        );
                    }
                });
            }
        });

        this.scriptForm.get('variable').valueChanges.subscribe((res) => {
            res.forEach((ele) => {
                if (ele.var_datatype != '') {
                    if (
                        !this.storeScriptVariables
                            .map((x) => {
                                return x['var_name'];
                            })
                            .includes(ele.var_name)
                    )
                        this.storeScriptVariables.push(ele);
                }
            });
        });

        this.scriptDialog = true;
    }

    saveScript() {
        this.submitButton.nativeElement.disabled = true;

        this.loading = true;

        // Create new Script
        if (this.scriptEditMode == 'new') {
            let apiValue = {
                control_id: this.getControlId(
                    this.scriptForm.get('control_id').value.split(' - ')[1]
                ),
                risk_id: this.getRiskId(
                    this.scriptForm.get('risk_id').value.split(' - ')[0]
                ),
                au_level_4_id: this.getAuditId(
                    this.scriptForm.get('au_id').value.split(' - ')[1]
                ),
                banner_id: this.getBannerId(
                    this.scriptForm.get('banner_id').value.split(' - ')[0]
                ),
                script_sql: this.scriptForm.get('sql_script').value,
                script_presto: this.scriptForm.get('script_presto').value,
                script_defination:
                    this.scriptForm.get('sql_definition').value || '',
                target_table: this.scriptForm.get('target_table').value,
                schedule_day: this.scriptForm.get('schedule_day').value || '',
                start_time_interval:
                    +(
                        this.scriptForm
                            .get('start_time_interval')
                            .value?.getHours() +
                        '' +
                        this.scriptForm
                            .get('start_time_interval')
                            .value?.getMinutes()
                    ) || 0,
                start_time_interval_end:
                    +(
                        this.scriptForm
                            .get('start_time_interval_end')
                            .value?.getHours() +
                        '' +
                        this.scriptForm
                            .get('start_time_interval_end')
                            .value?.getMinutes()
                    ) || 0,
                role_access:
                    this.getRoleAccessIds(
                        this.scriptForm.get('role_access').value
                    ) || '',
                scriptVaribales: this.scriptForm.value.variable,
                record_status: 1,
            };

            if (
                this.scriptForm.get('sql_script').value != '' ||
                this.scriptForm.get('script_presto').value != ''
            ) {
                if (
                    this.scriptDefaultVariables.every((x) => {
                        return this.scriptForm
                            .get('script_presto')
                            .value.includes(x);
                    }) ||
                    this.scriptDefaultVariables.every((x) => {
                        return this.scriptForm
                            .get('sql_script')
                            .value.includes(x);
                    })
                ) {
                    this.scriptService
                        .addScript(apiValue)
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
                            if ((res.message = 'Success')) {
                                this.getScript();

                                this.scriptDialog = false;
                                this.loading = false;
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Successful',
                                    detail: 'New Script Created !!',
                                    life: 3000,
                                });
                            }
                        });
                } else {
                    this.scirptError = true;
                }
            } else {
                this.confirmationService.confirm({
                    header: 'ERROR!!',
                    icon: 'pi pi-exclamation-triangle',
                    message: 'You must have a one sql query',
                });
            }
        }
        // Edit Script
        else if (this.scriptEditMode == 'edit') {
            let apiValue = {
                record_id: this.scriptForm.get('record_id').value,
                script_id: this.scriptForm.get('script_id').value,
                version_id: this.scriptForm.get('version_id').value,
                version: this.scriptForm.get('version').value,
                original_version_id: this.scriptForm.get('original_version_id')
                    .value,
                control_id: this.getControlId(
                    this.scriptForm.get('control_id').value.split(' - ')[1]
                ),
                risk_id: this.getRiskId(
                    this.scriptForm.get('risk_id').value.split(' - ')[0]
                ),
                au_level_4_id: this.getAuditId(
                    this.scriptForm.get('au_id').value.split(' - ')[1]
                ),
                banner_id: this.getBannerId(
                    this.scriptForm.get('banner_id').value.split(' - ')[0]
                ),
                script_sql: this.scriptForm.get('sql_script').value,
                script_presto: this.scriptForm.get('script_presto').value,
                script_defination: this.scriptForm.get('sql_definition').value,
                target_table: this.scriptForm.get('target_table').value,
                schedule_day: this.scriptForm.get('schedule_day').value,
                start_time_interval:
                    +(
                        this.scriptForm
                            .get('start_time_interval')
                            .value?.getHours() +
                        '' +
                        this.scriptForm
                            .get('start_time_interval')
                            .value?.getMinutes()
                    ) || 0,
                start_time_interval_end:
                    +(
                        this.scriptForm
                            .get('start_time_interval_end')
                            .value?.getHours() +
                        '' +
                        this.scriptForm
                            .get('start_time_interval_end')
                            .value?.getMinutes()
                    ) || 0,
                schedule_status: this.scriptForm.get('schedule_status').value,
                role_access:
                    this.getRoleAccessIds(
                        this.scriptForm.get('role_access').value
                    ) || '',
                scriptVaribales: this.scriptForm.value.variable,
                record_status:
                    this.scriptForm.value.record_status == true ? 1 : 0,
            };

            if (
                this.scriptForm.get('sql_script').value != '' ||
                this.scriptForm.get('script_presto').value != ''
            ) {
                if (
                    this.scriptDefaultVariables.every((x) => {
                        return this.scriptForm
                            .get('script_presto')
                            .value.includes(x);
                    }) ||
                    this.scriptDefaultVariables.every((x) => {
                        return this.scriptForm
                            .get('sql_script')
                            .value.includes(x);
                    })
                ) {
                    this.scriptService
                        .editScript(apiValue, this.scriptForm.value.record_id)
                        .pipe(
                            catchError((err) => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'ERROR!!',
                                    detail: 'Something Went Wrong !!',
                                    life: 3000,
                                });
                                //       console.log(err);
                                return throwError(err);
                            }),
                            finalize(() => {
                                this.loading = false;
                                this.selectedScript = null;
                            })
                        )
                        .subscribe((res) => {
                            if (res.data) {
                                this.getScript();

                                this.scriptDialog = false;
                                this.loading = false;
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Successful',
                                    detail: 'Script Edited !!',
                                    life: 3000,
                                });
                                this.selectedScript = null;
                            } else {
                                this.getScript();

                                this.scriptDialog = false;
                                this.loading = false;
                                this.messageService.add({
                                    severity: 'info',
                                    summary: 'Info !!',
                                    detail: 'A test exist with the script, create new version or delete test',
                                    life: 3000,
                                });
                                this.selectedScript = null;
                            }
                        });
                } else {
                    this.scirptError = true;
                }
            } else {
                this.confirmationService.confirm({
                    header: 'ERROR!!',
                    icon: 'pi pi-exclamation-triangle',
                    message: 'You must have a one sql query',
                });
            }
        }
        // Creting New Version
        else {
            let apiValue = {
                script_id: this.scriptForm.get('script_id').value,
                original_version_id: this.scriptForm
                    .get('version_id')
                    .value.toString(),
                control_id: this.getControlId(
                    this.scriptForm.get('control_id').value.split(' - ')[1]
                ),
                risk_id: this.getRiskId(
                    this.scriptForm.get('risk_id').value.split(' - ')[0]
                ),
                au_level_4_id: this.getAuditId(
                    this.scriptForm.get('au_id').value.split(' - ')[1]
                ),
                banner_id: this.getBannerId(
                    this.scriptForm.get('banner_id').value.split(' - ')[0]
                ),
                script_sql: this.scriptForm.get('sql_script').value,
                script_presto: this.scriptForm.get('script_presto').value,
                script_defination: this.scriptForm.get('sql_definition').value,
                target_table: this.scriptForm.get('target_table').value,
                schedule_day: this.scriptForm.get('schedule_day').value,
                start_time_interval:
                    +(
                        this.scriptForm
                            .get('start_time_interval')
                            .value?.getHours() +
                        '' +
                        this.scriptForm
                            .get('start_time_interval')
                            .value?.getMinutes()
                    ) || 0,
                start_time_interval_end:
                    +(
                        this.scriptForm
                            .get('start_time_interval_end')
                            .value?.getHours() +
                        '' +
                        this.scriptForm
                            .get('start_time_interval_end')
                            .value?.getMinutes()
                    ) || 0,
                role_access:
                    this.getRoleAccessIds(
                        this.scriptForm.get('role_access').value
                    ) || '',
                scriptVaribales: this.scriptForm.value.variable,
                record_status: 1,
            };

            if (
                this.scriptForm.get('sql_script').value != '' ||
                this.scriptForm.get('script_presto').value != ''
            ) {
                if (
                    this.scriptDefaultVariables.every((x) => {
                        return this.scriptForm
                            .get('script_presto')
                            .value.includes(x);
                    }) ||
                    this.scriptDefaultVariables.every((x) => {
                        return this.scriptForm
                            .get('sql_script')
                            .value.includes(x);
                    })
                ) {
                    this.scriptService
                        .addScript(apiValue)
                        .pipe(
                            catchError((err) => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'ERROR!!',
                                    detail: 'Something Went Wrong !!',
                                    life: 3000,
                                });
                                //   console.log(err);
                                return throwError(err);
                            })
                        )
                        .subscribe((res) => {
                            if (res.message == 'Success') {
                                this.getScript();

                                this.scriptDialog = false;
                                this.loading = false;
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Successful',
                                    detail: 'New Version Created !!',
                                    life: 3000,
                                });
                                this.selectedScript = null;
                            }
                        });
                } else {
                    this.scirptError = true;
                }
            } else {
                this.confirmationService.confirm({
                    header: 'ERROR!!',
                    icon: 'pi pi-exclamation-triangle',
                    message: 'You must have a one sql query',
                });
            }
        }
        this.submitButton.nativeElement.disabled = false;
    }

    changeStatus(script: Script, event) {
        this.loading = true;

        this.scriptService
            .updateStatus(script.record_id)
            .pipe(
                catchError((err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!!',
                        detail: 'Something Went Wrong !!',
                        life: 3000,
                    });
                    //    console.log(err);
                    return throwError(err);
                })
            )
            .subscribe((res: any) => {
                if (res.message == 'Success') {
                    this.getScript();
                    this.loading = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success!!',
                        detail: 'Status Changed !!',
                        life: 3000,
                    });
                    this.selectedScript = null;
                }
            });
    }

    deleteScript(ele) {
        this.confirmationService.confirm({
            header: 'Confirmation!',
            message: 'Do you want to delete this script?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.scriptService
                    .deleteScript(ele.script_id, ele.version_id)
                    .pipe(
                        catchError((err) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'ERROR!!',
                                detail: 'Something Went Wrong !!',
                                life: 3000,
                            });
                            //    console.log(err);
                            return throwError(err);
                        })
                    )
                    .subscribe((res) => {
                        if (res.message == 'Success') {
                            this.getScript();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success!!',
                                detail: 'Script Deleted !!',
                                life: 3000,
                            });
                            this.selectedScript = null;
                        } else {
                            this.getScript();
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Info !!',
                                detail: res.message,
                                life: 3000,
                            });
                            this.selectedScript = null;
                        }
                    });
            },
            reject: () => {
                // console.log(false);
            },
        });
    }

    showScript(script, title) {
        this.showScriptPop = true;
        this.showScriptPopTitle = title;
        this.showScriptContent = script;
    }

    clearChange() {
        this.changePrestoScript = true;
        this.changeSqlScript = true;
        this.showPopupText = false;
    }

    clear(table: Table) {
        table.clear();
        // this.filter.nativeElement.value = '';
    }

    popupHeader;

    getText(val, _formGroup: FormGroup, _formControlName, title) {
        if (!this.showPopupText) {
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
    }

    selectScript(script) {
        this.selectedScript = [script];
    }

    selectControl(ele) {
        this.scriptService
            .getAutoFillFields(this.getControlId(ele.split(' - ')[1]))
            .subscribe((res) => {
                this.scriptForm
                    .get('au_id')
                    .setValue(this.getAuditDesc(res.data[0].au_level_4_id));
                this.scriptForm
                    .get('banner_id')
                    .setValue(this.getBannerDesc(res.data[0].department_id));
                this.scriptForm
                    .get('risk_id')
                    .setValue(this.getRiskDesc(res.data[0].risk_id));
            });
    }

    getControlId(control: string): number {
        let x: Script = this.control.filter((ele) => {
            return ele.control == control;
        });

        return x[0].control_id;
    }

    getControlDesc(control_id: number) {
        let x: Script = this.control.filter((ele) => {
            return ele.control_id == control_id;
        });

        return x[0].control_uid + ' - ' + x[0].control;
    }

    getRiskId(risk: string): number {
        let x: Script = this.risk.filter((ele) => {
            return ele.risk_uid == risk;
        });

        return x[0].risk_id;
    }

    getRiskDesc(risk_id: number) {
        let x: Script = this.risk.filter((ele) => {
            return ele.risk_id == risk_id;
        });

        return x[0].risk_uid + ' - ' + x[0].risk;
    }

    getBannerId(banner: string): number {
        let x: Script = this.banner.filter((ele) => {
            return ele.department_uid == banner;
        });

        return x[0].department_id;
    }

    getBannerDesc(banner_id: number) {
        let x: Script = this.banner.filter((ele) => {
            return ele.department_id == banner_id;
        });

        return x[0].department_uid + ' - ' + x[0].organization;
    }

    getAuditId(audit: string): number {
        let x: Script = this.audit.filter((ele) => {
            return ele.au_level_4_desc == audit;
        });

        return x[0].au_level_4_id;
    }

    getAuditDesc(au_level_4_id: number) {
        let x: Script = this.audit.filter((ele) => {
            return ele.au_level_4_id == au_level_4_id;
        });

        return x[0].au_level_4_uid + ' - ' + x[0].au_level_4_desc;
    }

    getRoleAccessIds(profiles) {
        if (profiles) {
            let ids = '';
            profiles.forEach((element, index) => {
                if (index == 0) {
                    ids = element;
                } else {
                    ids += ',' + element;
                }
            });
            return ids;
        } else {
            return 0;
        }
    }

    getRoleAccess(ids) {
        let x = [];
        if (ids != null && ids != 0) {
            ids.split(',').forEach((element) => {
                this.profiles?.forEach((ele) => {
                    if (ele.id == element) {
                        x.push(ele.role);
                    }
                });
            });
        }
        return x;
    }

    filterRisk(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.risk.length; i++) {
            const ele = this.risk[i];
            if (ele.process == null) {
                filtered.push(ele.process);
            } else if (
                ele.process
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0 ||
                ele.risk_uid
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0 ||
                ele.business_objective
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                filtered.push(
                    ele.risk_uid +
                        ' - ' +
                        ele.process +
                        '-' +
                        ele.business_objective.substring(0, 30)
                );
            }
        }

        this.filteredRisk = filtered;
    }

    filterAudit(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.audit.length; i++) {
            const ele = this.audit[i];

            if (ele.au_level_4_desc == null) {
                filtered.push(ele.au_level_4_desc);
            } else if (
                ele.au_level_4_desc
                    .toString()
                    .toLowerCase()
                    .includes(query.toString().toLowerCase()) ||
                ele.au_level_4_uid
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                filtered.push(ele.au_level_4_uid + ' - ' + ele.au_level_4_desc);
            }
        }

        this.filteredAudit = filtered;
    }

    filterBanner(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.banner.length; i++) {
            const ele = this.banner[i];
            if (ele.banner == null) {
                filtered.push(ele.banner);
            } else if (
                ele.banner
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0 ||
                ele.banner_uid
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                filtered.push(ele.banner_uid + ' - ' + ele.banner);
            }
        }

        this.filteredBanner = filtered;
    }

    filterControl(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.control.length; i++) {
            const ele = this.control[i];
            if (ele.control == null) {
                filtered.push(ele.control);
            } else if (
                ele.control
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toString().toLowerCase()) != -1 ||
                ele.control_uid
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toString().toLowerCase()) != -1
            ) {
                filtered.push(ele.control_uid + ' - ' + ele.control);
            }
        }

        this.filteredControl = filtered;
    }

    filterDay(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.day.length; i++) {
            const ele = this.day[i];
            if (ele.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(ele);
            }
        }

        this.filteredDay = filtered;
    }

    filterDatatypes(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.datatypes.length; i++) {
            const ele = this.datatypes[i];
            if (ele.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(ele);
            }
        }

        this.filteredDatatypes = filtered;
    }

    day = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thrusday',
        'Friday',
        'Saturday',
    ];
    datatypes = ['char', 'int', 'boolean', 'date'];
    scriptDefaultVariables = [
        '$AuditTestHistoryID',
        '$AuditTestID',
        '$RiskID',
        '$ControlID',
        '$ScriptID',
    ];
}
