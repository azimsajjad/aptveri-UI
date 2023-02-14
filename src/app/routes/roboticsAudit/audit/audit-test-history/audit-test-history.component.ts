import { formatDate } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { AuditTest } from 'src/app/api/robotic-audit';
import { AuditService } from 'src/app/service/audit.service';
import { audit } from 'src/app/api/roboticsAudit/audit';
import { AuditProgram } from 'src/app/api/roboticsAudit/audit-program';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
    selector: 'app-audit-test-history',
    templateUrl: './audit-test-history.component.html',
    styleUrls: ['./audit-test-history.component.scss'],
})
export class AuditTestHistoryComponent implements OnInit, OnChanges {
    @Input() audit: audit[];
    @Input() auditProgram: AuditProgram[];
    @Input() auditTest: AuditTest[];

    loading: boolean = true;

    auditTestHistory;
    auditTHSelection;

    res_target_table;
    res_auditTHname;

    auditTestHistoryForm: FormGroup;

    items: MenuItem[];

    constructor(
        private auditService: AuditService,
        private _formbuilder: FormBuilder,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public utilService: UtilsService
    ) {}

    ngOnInit(): void {
        this.items = [
            {
                icon: 'pi pi-refresh',
                command: () => {
                    this.getTestHistory();
                },
            },
            {
                icon: 'pi pi-file-excel',
                command: () => {
                    this.downloadExcel();
                },
            },
        ];
    }

    ngOnChanges(): void {
        this.auditTHSelection = null;
        if (this.auditTest) {
            this.getTestHistory();
        }
    }

    getTestHistory() {
        let ids = [];
        let x = [];
        this.auditTest.forEach((element) => {
            ids.push(element.audit_test_id);
        });

        ids.forEach((ele, index) => {
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

                if (index == ids.length - 1) {
                    this.auditTestHistory = x;
                    this.auditTestHistory.sort(
                        (a, b) => b.audit_history_id - a.audit_history_id
                    );
                    this.loading = false;
                }
            });
        });
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
                                this.getTestHistory();
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
        this.res_target_table = ele.target_table;
        this.res_auditTHname = ele.audit_history_uid;

        if (this.auditTestHistoryForm?.value == undefined) {
            this.auditTestHistoryForm = this._formbuilder.group({
                audit_history_id: ele.audit_history_id,
                notes: ele.notes,
                results: ele.results,
            });
        }
    }

    changeHistoryStatus(ele) {
        if (ele == null || ele == 'Fail') {
            this.auditTestHistoryForm.get('results').setValue('Pass');
        } else {
            this.auditTestHistoryForm.get('results').setValue('Fail');
        }
    }

    saveTestHistory() {
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
                    this.auditTestHistoryForm.reset();
                    this.getTestHistory();
                    return throwError(err);
                })
            )
            .subscribe((res) => {
                if (res.data) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Audit Test History Edited !!',
                        life: 3000,
                    });
                    this.auditTHSelection = null;
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!!',
                        detail: 'Something Went Wrong !!',
                        life: 3000,
                    });
                    this.auditTHSelection = null;
                }
            });
    }

    async viewResults() {
        this.loading = true;
        let checkTargetTable = await this.auditService
            .checktargettablenew(this.res_target_table)
            .catch((err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'ERROR!!',
                    detail: err,
                    life: 3000,
                });
            })
            .finally(() => {
                this.loading = false;
            });

        if (checkTargetTable.data == 1) {
            this.confirmationService.confirm({
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                message: 'Downloading will take time. Do you want to continue?',
                accept: async () => {
                    this.loading = true;
                    this.router.navigateByUrl(
                        'pages/view-result/' +
                            encodeURIComponent(btoa(this.res_target_table)) +
                            '/' +
                            encodeURIComponent(btoa(this.res_auditTHname))
                    );
                },
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'ERROR!!',
                detail: 'Target Table Does not Exist !!',
                life: 3000,
            });
            this.loading = false;
        }
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

    checktargettables;
    checktt: any[];
    arrData: any[];
    targettablesnew;
    datetime = new Date();

    async exportResultToExcelnew() {
        this.loading = true;
        const dataaudits = this.audit;
        const dataprogram = this.auditProgram;
        const datatest = this.auditTest;

        for (var i = 0; i < dataprogram.length; i++) {
            if (datatest.length > 0) {
                const title = 'AuditReport';

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
                const data4testhistory = this.auditTHSelection.filter(
                    (x) =>
                        x.ap_id == dataprogram[i].audit_program_id &&
                        x.job_run_status == 5
                );

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

                data4testhistory.forEach((item) => {
                    worksheet_3.addRow({
                        AuditTest_ID: item.audit_test_uid,
                        AuditTest_Desc: item.audit_test_desc,
                        Risk_ID: item.risk_uid,
                        Risk_Desc: item.audit_risk,
                        Control_ID: item.control_uid,
                        Control_Desc: item.control,
                        Script_ID: item.script_uid,
                        Script_Desc: item.script_defination,
                        Results: item.results,
                        Notes: item.notes,
                        audit_run_status_text: item.audit_run_status_text,
                        audit_history_uid: item.audit_history_uid,
                        Results_url:
                            item.target_table != null
                                ? {
                                      text: item.target_table,
                                      hyperlink:
                                          '#' + item.target_table + '!A1',
                                  }
                                : '',
                    });
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
        this.loading = false;
    }

    // filters ...

    getTwoDigit(val) {
        return ('0' + val).slice(-2);
    }
}
