import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, finalize, forkJoin, throwError } from 'rxjs';
import { DataAULevel4 } from 'src/app/api/auditUniverse';
import { Banner, Script } from 'src/app/api/libraries';
import { AdhocTest, JobRunStatus } from 'src/app/api/roboticsAudit/adhoc-test';
import { AdhocService } from 'src/app/service/adhoc.service';
import { AuditService } from 'src/app/service/audit.service';
import { AuditUniverseService } from 'src/app/service/audituniverseservice';
import { ScriptService } from 'src/app/service/scriptservices';

@Component({
    selector: 'app-adhoc-test',
    templateUrl: './adhoc-test.component.html',
    styleUrls: ['./adhoc-test.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class AdhocTestComponent implements OnInit {
    constructor(
        private confirmationService: ConfirmationService,
        private adhocService: AdhocService,
        private auditService: AuditService,
        private auditUniverseService: AuditUniverseService,
        private scriptService: ScriptService,
        private fb: FormBuilder,
        private messageService: MessageService
    ) {}

    loading: boolean = true;
    adhocTestDialog: boolean = false;
    showScriptPop: boolean = false;
    selectedAdhoc: AdhocTest[];
    showScriptContent;

    banner: Banner[];
    auditUniverseL4: DataAULevel4[];
    script: Script[];
    jobStatus: JobRunStatus[];

    adhocTest: AdhocTest[];

    adhocForm: FormGroup;
    editAdhocForm: FormGroup;

    @ViewChild('dt') table: Table;

    ngOnInit(): void {
        let ban = this.auditService.sendGetBannerRequest();
        let aud = this.auditUniverseService.getAuditUniverseLevel4Script(0);
        let scr = this.scriptService.getScript(0);
        let job = this.adhocService.getJobRunStatus();

        forkJoin([ban, aud, scr, job]).subscribe((results: any) => {
            this.getAdhocTest();
            this.banner = results[0].data;
            this.auditUniverseL4 = results[1].data.data;
            this.script = results[2].data;
            this.jobStatus = results[3].data;
        });
    }

    getAdhocTest(adhoc_id: number = 0) {
        this.adhocService.getAdhocTest(adhoc_id).subscribe((res) => {
            this.loading = false;

            this.adhocTest = res.data.map((ele) => {
                if (ele.replaced_presto_script != null) {
                    ele['presto'] = ele.replaced_presto_script;
                } else {
                    ele['presto'] = ele.presto_script;
                }
                if (ele.replaced_sql_script != null) {
                    ele['sql'] = ele.replaced_sql_script;
                } else {
                    ele['sql'] = ele.sql_script;
                }
                return ele;
            });

            this.adhocTest.map((element) => {
                element['job_run_status'] = this.getJobStatus(
                    element['job_run_status']
                );
                element['adhoc_run_status'] = this.getJobStatus(
                    element['adhoc_run_status']
                );
            });
        });
    }

    getSelection() {
        this.editAdhocForm = this.fb.group({
            adhoctest_id: this.selectedAdhoc[0].adhoctest_id,
            notes: this.selectedAdhoc[0].notes,
            results: this.selectedAdhoc[0]['results'],
        });
    }

    open() {
        this.adhocTestDialog = true;
        this.adhocForm = this.fb.group({
            adhoctest_desc: null,
            au_level_4_id: [null, Validators.required],
            script_id: [null, Validators.required],
            banner_id: [null, Validators.required],
            run_datetime: [null, Validators.required],
            store: [true, Validators.required],
            scriptVariables: this.fb.array([]),
        });
    }

    saveAdhoc() {
        this.loading = true;

        this.adhocForm
            .get('banner_id')
            .setValue(this.getBannerId(this.adhocForm.get('banner_id').value));
        this.adhocForm
            .get('au_level_4_id')
            .setValue(
                this.getAuditUniverse4Id(
                    this.adhocForm.get('au_level_4_id').value
                )
            );
        this.adhocForm
            .get('script_id')
            .setValue(this.getScriptId(this.adhocForm.get('script_id').value));
        this.adhocForm.value['presto_script'] = this.getPrestoScript(
            this.adhocForm.get('script_id').value
        );
        this.adhocForm.value['sql_script'] = this.getSqlScript(
            this.adhocForm.get('script_id').value
        );
        this.adhocForm.value['target_table_name'] = this.getTargetTable(
            this.adhocForm.get('script_id').value
        );

        this.adhocService
            .addAdhocTest(this.adhocForm.value)
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
                }),
                finalize(() => {
                    this.adhocTestDialog = false;
                    this.loading = false;
                    this.getAdhocTest();
                })
            )
            .subscribe((res) => {
                if (res.data) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'New Adhoc Test Created !!',
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
    }

    editAdhoc() {
        this.adhocService
            .editAdhocTest(this.editAdhocForm.value)
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
                }),
                finalize(() => {
                    this.selectedAdhoc = null;
                    this.adhocTestDialog = false;
                    this.loading = false;
                    this.getAdhocTest();
                })
            )
            .subscribe((res: any) => {
                if (res.data) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Adhoc Test Edited !!',
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
    }

    runAdhoc(ele: AdhocTest[]) {
        this.loading = true;

        let ids = [];
        ele.forEach((element) => {
            ids.push(element.adhoctest_id);
        });
        this.adhocService
            .runAdhocTest(ids)
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
                }),
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe((res) => {
                if (res.message == 'Success') {
                    res.data.forEach((element) => {
                        this.messageService.add({
                            severity: element.code == 1 ? 'info' : 'success',
                            summary:
                                element.code == 1 ? 'Info !' : 'Successful',
                            detail: element.message,
                            life: 3000,
                        });
                    });
                } else {
                    res.data.forEach((element) => {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Info !',
                            detail: element.message,
                            life: 3000,
                        });
                    });
                }
            });
    }

    deleteAdhoc(adhocTest: AdhocTest) {
        this.confirmationService.confirm({
            header: 'Confirmation',
            message: 'Are you sure to delete this Adhoc-Test?',
            accept: () => {
                this.adhocService
                    .deleteAdhocTest(adhocTest.adhoctest_id)
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
                    .subscribe((res) => {
                        if (res.data) {
                            this.loading = false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Adhoc Test Deleted !!',
                                life: 3000,
                            });
                            this.getAdhocTest();
                            this.selectedAdhoc = null;
                        } else {
                            this.loading = false;
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Info Message',
                                detail: res.message,
                                life: 6000,
                            });
                            this.getAdhocTest();
                            this.selectedAdhoc = null;
                        }
                    });
            },
            reject: () => {
                console.log('rejected');
            },
        });
    }

    showScript(script) {
        this.showScriptPop = true;
        this.showScriptContent = script;
    }

    // FilterCode

    filteredBanner;
    filteredAuditUniverseL4;
    filteredScript;

    filterBanner(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.banner.length; i++) {
            const ele = this.banner[i];
            if (ele.department_uid == null) {
                filtered.push(ele.department_uid);
            } else if (
                ele.department_uid
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0 ||
                ele.department
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                filtered.push(ele.department_uid + ' - ' + ele.department);
            }
            this.filteredBanner = filtered;
        }
    }

    getBannerId(val: String): number {
        let x = this.banner.filter((ele) => {
            return ele.department_uid + ' - ' + ele.department == val;
        });
        return x[0]?.department_id || null;
    }

    getBanner(banner_id: number): any {
        let x = this.banner.filter((ele) => {
            return ele.department_id == banner_id;
        });
        if (x.length > 0)
            return x[0].department_uid + ' - ' + x[0].organization;
        else {
            this.adhocTestDialog = false;
            this.messageService.add({
                severity: 'info',
                summary: 'Info !!',
                detail: "Selected Adhoc Test's Script not found !!",
                life: 6000,
            });
        }
    }

    filterAuditUniverse4(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.auditUniverseL4.length; i++) {
            const ele = this.auditUniverseL4[i];
            if (ele.au_level_4_uid == null) {
                filtered.push(ele.au_level_4_uid);
            } else if (
                ele.au_level_4_uid
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0 ||
                ele.au_level_4_desc
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase())
            ) {
                filtered.push(ele.au_level_4_uid + ' - ' + ele.au_level_4_desc);
            }

            this.filteredAuditUniverseL4 = filtered;
        }
    }

    getAuditUniverse4Id(val: String): number {
        let x = this.auditUniverseL4.filter((ele) => {
            return ele.au_level_4_uid + ' - ' + ele.au_level_4_desc == val;
        });
        return x[0]?.au_level_4_id || null;
    }

    getAuditUniverse4(au_level_4_id: number): any {
        let x = this.auditUniverseL4.filter((ele) => {
            return ele.au_level_4_id == au_level_4_id;
        });
        if (x.length > 0)
            return x[0].au_level_4_uid + ' - ' + x[0].au_level_4_desc;
        else {
            this.adhocTestDialog = false;
            this.messageService.add({
                severity: 'info',
                summary: 'Info !!',
                detail: "Selected Adhoc Test's Audit Universe not found !!",
                life: 6000,
            });
        }
    }

    filterScript(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.script.length; i++) {
            const ele = this.script[i];
            if (ele.script_defination == null) {
                filtered.push(ele.script_defination);
            } else if (
                ele.script_defination
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                filtered.push(ele.script_defination);
            }

            this.filteredScript = filtered;
        }
    }

    getScriptId(val: String): number {
        let x = this.script.filter((ele) => {
            return ele.script_defination == val;
        });
        return x[0]?.script_id || null;
    }

    getScript(script_id: number): any {
        let x = this.script.filter((ele) => {
            return ele.script_id == script_id;
        });

        if (x.length > 0) return x[0].script_defination;
        else {
            this.adhocTestDialog = false;
            this.messageService.add({
                severity: 'info',
                summary: 'Info !!',
                detail: "Selected Adhoc Test's Script not found !!",
                life: 6000,
            });
        }
    }

    getPrestoScript(script_id: number): any {
        let x = this.script.filter((ele) => {
            return ele.script_id == script_id;
        });

        if (x.length > 0) return x[0].script_presto;
    }

    getSqlScript(script_id: number): any {
        let x = this.script.filter((ele) => {
            return ele.script_id == script_id;
        });

        if (x.length > 0) return x[0].script_sql;
    }

    getTargetTable(script_id: number): any {
        let x = this.script.filter((ele) => {
            return ele.script_id == script_id;
        });

        if (x.length > 0) return x[0].target_table;
    }

    getScriptVariable(script_id: number): any {
        let x = this.script.filter((ele) => {
            return ele.script_id == script_id;
        });

        if (x.length > 0) return x[0].scriptVaribales;
    }

    getJobStatus(val: any): string {
        let x = this.jobStatus.filter((ele) => {
            return ele.codeId == +val;
        })[0];

        return x?.codeName || null;
    }

    onSelectScript(event) {
        this.getScriptVariable(this.getScriptId(event)).forEach((scriptvar) => {
            (<FormArray>this.adhocForm.get('scriptVariables')).push(
                this.fb.group({
                    var_id: scriptvar.var_id,
                    var_name: scriptvar.var_name,
                    var_datatype: scriptvar.var_datatype,
                    var_value: [scriptvar.var_value],
                })
            );
        });
    }

    storeList = [
        { viewValue: 'Yes', code: true },
        { viewValue: 'No', code: false },
    ];

    scriptDefaultVariables = [
        '$AuditTestHistoryID',
        '$AuditTestID',
        '$RiskID',
        '$ControlID',
        '$ScriptID',
        '$Banner',
    ];
}
