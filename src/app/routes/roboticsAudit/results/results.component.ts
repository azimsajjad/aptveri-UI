import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { audit } from 'src/app/api/roboticsAudit/audit';
import { AuditService } from '../../../service/audit.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';

import { AuthService } from '../../../service/auth.service';
import { ExportExcelService } from '../../../service/export-excel.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

import {
    catchError,
    debounceTime,
    finalize,
    forkJoin,
    map,
    throwError,
} from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { count } from 'console';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class ResultsComponent implements OnInit {
    audits: audit[];
    aduitsres: audit[];
    dataForExcel = [];
    arrData: any[];
    dataaudits: audit;
    datetime = new Date();
    targettables: any[];
    checktt: any[];
    checktargettables: any = 0;
    targettablesnew;
    audit: audit;
    loading: boolean = true;
    loadingE: boolean = false;
    AuditBanner: any[];
    selectedaudits: audit[];
    auditSelection: audit[];
    submitted: boolean;
    loadingP: boolean = true;
    loadingT: boolean = true;
    loadingTH: boolean = true;
    auditProgramDialog: boolean = false;
    auditTestDialog: boolean = false;
    auditTestHistoryDialog: boolean = false;
    auditPSelection;
    auditTSelection;
    auditTHSelection;
    scriptSelection;
    auditId;
    ap_id;
    res_target_table;
    audit_test_id;
    audit_history_id;
    auditProgramMode;
    auditTestMode;
    isShown: boolean = true;
    auditProgramForm: FormGroup;
    auditTestForm: FormGroup;
    auditTestHistoryForm: FormGroup;
    count: number = 2;
    risk: any;
    filteredRisk: any;
    control: any;
    filteredControl: any;
    script;
    filteredScript;
    auditUniverse3;
    filteredAuditUniverse3;
    auditUniverse4;
    filteredAuditUniverse4;
    frequency;
    filteredFrequency;
    showScriptContent;

    showPopupText: boolean = false;
    showScriptPop: boolean = false;
    auditP;
    auditT;
    auditTH;
    auditeTH;
    auditTexcel;

    // ------for BU_ID-----

    selectedbannerdata: any;
    filteredAuditBanner: any[];

    // ------for AU_ID-----
    selectedaudituniversedata: any;
    filteredAuditUniverse: any[];
    AuditUniverse: any[];

    @ViewChild('dt1') table1: Table;
    @ViewChild('dt2') table2: Table;
    @ViewChild('dt3') table3: Table;
    // @ViewChild('filter') filter: ElementRef;

    cols: any[];
    @ViewChild('dt1') table: Table;

    @ViewChild('filter') filter: ElementRef;

    statuses: any[];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private auditService: AuditService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public accountSvr: AuthService,
        private http: HttpClient,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public ete: ExportExcelService
    ) {
        // debugger;
        // this.activatedRoute.params.subscribe((res) => {
        //     //  debugger;
        //     this.auditId = +atob(res.audit_id);
        //     this.ap_id = +atob(res.ap_id);
        //     this.audit_test_id = +atob(res.audit_test_id);
        //     this.audit_history_id = +atob(res.audit_history_id);
        //     //  this.auditPSelection = +atob(res.ap_id);
        //     //this.auditTSelection = +atob(res.audit_id);
        // });
    }

    ngOnInit() {
        // debugger;
        // if (this.auditId > 0) {
        //     this.isShown = false;
        //     this.getaudit(this.auditId);
        //     this.getAuditProgram(this.auditId);
        //     this.getTests();
        //     this.getTestHistory(this.audit_test_id);
        // } else {
        //     this.isShown = true;
        this.getaudit(0);
        //   }
        this.getBanner();
        this.getAuditUniverse();
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

    getAuditUniverse() {
        //debugger;
        this.auditService
            .sendGetAuditUniverseRequest()
            .subscribe((result: any) => {
                // console.log("audituniverse");
                // console.log(result);
                this.AuditUniverse = result.data.data;
                this.loading = false;
            });
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
                this.audits = res;
                //  console.log(res);
            });
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    selectaudit(ele) {
        // debugger;
        // let testId = [];
        // this.auditSelection.forEach((ele) => {
        //     testId.push(ele.audit_id);
        // });
        //this.getaudit(ele.audit_id);
        //  this.isShown = false;
        this.selectedaudits = [ele];
        if (this.selectedaudits.length == 1) {
            this.getAuditProgram(ele.audit_id);

            this.auditService
                .sendGetauditRequest(ele.audit_id)
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
                    this.aduitsres = res;
                    this.dataForExcel = res;
                    //  console.log(res);
                });
        } else if (this.selectedaudits.length > 1) {
            this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'You can not select more than one audit',
                life: 3000,
            });
        }
    }
    getAuditProgram(testId: any) {
        //  debugger;
        this.auditService.getAuditProgram(0, testId).subscribe((res) => {
            this.auditP = res.data;
            if (this.auditId > 0) {
                this.auditPSelection = res.data;
            }
            this.loadingP = false;
        });
    }

    selectTest(ele) {
        // debugger;
        let testId = [];
        this.res_target_table = ele.target_table;
        //  debugger;
        //   this.checktargettable(this.res_target_table);

        //alert(this.checktargettables);
        // if (this.checktargettables == 1) {

        // }
        this.auditTSelection.forEach((ele) => {
            testId.push(ele.audit_test_id);
        });

        this.getTestHistory(testId);
    }

    getTestHistory(testId: any) {
        //  debugger;
        this.auditTHSelection = null;
        let x = [];
        this.loadingTH = true;
        this.auditTH;
        testId.forEach((ele, index) => {
            this.auditService.getAuditTestHisexce(0, ele).subscribe((res) => {
                res.data.forEach((element) => {
                    x.push(element);
                });
                if (index == testId.length - 1) {
                    // debugger;
                    this.auditTH = x;
                    this.auditTH.sort(
                        (a, b) => b.audit_history_id - a.audit_history_id
                    );
                    //   console.log(this.auditTH);

                    this.loadingTH = false;
                }
            });
        });
    }

    // getTestHistory(testId: any) {
    //     debugger;
    //     let x = [];
    //     this.loadingTH = true;
    //     this.auditTH;
    //     this.auditeTH;

    //     if (this.auditId > 0) {
    //         // this.auditService
    //         //     .getAuditTestHistory(0, testId)
    //         //     .pipe(
    //         //         map((resp) => resp.data),
    //         //         catchError((err) => {
    //         //             this.messageService.add({
    //         //                 severity: 'error',
    //         //                 summary: 'ERROR!!',
    //         //                 detail: 'Something Went Wrong !!',
    //         //                 life: 3000,
    //         //             });
    //         //             // console.log(err);
    //         //             return throwError(err);
    //         //         }),
    //         //         finalize(() => {
    //         //             this.loadingTH = false;
    //         //         })
    //         //     )
    //         //     .subscribe((res) => {
    //         //         res.map((res) => {
    //         //             res.record_status == 0
    //         //                 ? (res.record_status = false)
    //         //                 : (res.record_status = true);
    //         //             return res;
    //         //         });
    //         //         this.auditTH = res;

    //         this.auditTH = await this.auditService.getExcelTestHistoryresult(
    //             0,
    //             testId
    //         );
    //         this.loadingTH = false;
    //         // });
    //     } else {
    //         testId.forEach((ele, index) => {
    //             this.auditeTH = this.auditService.getExcelTestHistoryresult(
    //                 0,
    //                 ele
    //             );
    //             console.log(this.auditeTH.data);

    //             this.auditeTH.data.forEach((element) => {
    //                 x.push(element);
    //             });
    //             if (index == testId.length - 1) {
    //                 this.auditTH = x;
    //                 this.loadingTH = false;
    //             }
    //         });
    //         // this.auditService
    //         //     .getAuditTestHistory(0, ele)
    //         //     .subscribe((res) => {
    //         //         res.data.forEach((element) => {
    //         //             x.push(element);
    //         //         });
    //         //         if (index == testId.length - 1) {
    //         //             this.auditTH = x;
    //         //             this.loadingTH = false;
    //         //         }
    //         //     });
    //     }
    // }
    selectRow(ele) {
        this.auditPSelection = [ele];
        this.getTests();
    }

    getBanner() {
        this.auditService.sendGetBannerRequest().subscribe((result: any) => {
            this.AuditBanner = result.data;
            this.loading = false;

            // console.log(result);
        });
    }

    getTests() {
        //  debugger;
        let programId = [];
        let x = [];
        this.auditT;
        this.loadingT = true;

        if (this.auditId > 0) {
            //this.auditPSelection = this.auditP;
            // this.http
            //     .get<any>('http://192.168.1.9:5100/api/Audit/Test/0/11')
            //     .subscribe((data) => {
            //         console.log(data.data);
            //         this.auditT = data.data;
            //         this.loadingT = false;
            //     });

            this.auditService
                .getAuditexcelTestresult(0, this.ap_id)
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
                        this.loadingT = false;
                    })
                )
                .subscribe((res) => {
                    res.map((res) => {
                        res.record_status == 0
                            ? (res.record_status = false)
                            : (res.record_status = true);
                        return res;
                    });
                    this.auditT = res;
                    //  console.log(this.auditT);
                    this.auditTSelection = res;
                    this.loadingT = false;
                });
            //    programId.forEach((ele, index) => {
            // this.auditService
            //     .getAuditTest(0, this.ap_id)
            //     .subscribe((res: any) => {
            //         res.data.forEach((element) => {
            //             x.push(element);
            //         });
            //         //  if (index == programId.length - 1) {
            //         this.auditT = x;
            //         this.loadingT = false;
            //         //    }
            //     });
            //   });
        } else {
            this.auditPSelection.forEach((ele) => {
                return programId.push(ele.audit_program_id);
            });
            programId.forEach((ele, index) => {
                this.auditService
                    .getAuditexcelTestresult(0, ele)
                    .subscribe((res: any) => {
                        res.data.forEach((element) => {
                            x.push(element);
                        });
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
        }
    }

    checktargettable(id: string) {
        //debugger;
        this.auditService.checktargettable(id).subscribe((data) => {
            //  console.log(data.data);
            // debugger;
            this.checktargettables = data.data;
            if (this.checktargettables == 1) {
                this.gettargettable(id);
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
                // console.log(res);
            });
    }

    exportToExcel() {
        this.audits.forEach((row: any) => {
            this.dataForExcel.push(Object.values(row));
        });

        let reportData = {
            title: 'AuditReport',
            data: this.dataForExcel,
            headers: Object.keys(this.audits[0]),
        };

        this.ete.exportExcel(reportData, 'Audit');
    }

    async exportResultToExcel() {
        //  debugger;
        for (var i = 0; i < this.auditPSelection.length; i++) {
            // await this.auditService
            //     .getExcelTestHistoryresult(
            //         0,
            //         this.auditPSelection[i].audit_program_id
            //     )
            //     .subscribe({
            //         next: (data) => {
            //             debugger;
            //             this.auditTexcel = data.data;
            //             // this.checktargettable(this.auditTexcel[0].target_table);
            //             this.exportResultToExcelnew();
            //             console.log(data.data);
            //         },
            //         error: (e) => console.error(e),
            //     });
        }
    }

    async getEmpData(apid: number) {
        // const data = await this.auditService
        //     .getExcelTestHistoryresult(0, apid)
        //     .toPromise();
        // this.auditTexcel = data;
        // this.auditService.getExcelTestHistoryresult(0, apid).pipe(
        //     map((data) => {
        //         this.auditTexcel = data;
        //         console.log(this.auditTexcel);
        //     })
        // );
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
        let strexcel = '';
        this.loadingE = true;

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
        for (var i = 0; i < this.auditPSelection.length; i++) {
            this.auditTexcel =
                await this.auditService.getExcelTestHistoryresult(
                    0,
                    this.auditPSelection[i].audit_program_id
                );
            if (this.auditTexcel.data.length > 0) {
                //    debugger;
                const data2 = this.auditTexcel.data;
                // console.log(data2);

                const title = 'AuditReport';

                //  const header_1 = Object.keys(this.aduitsres[0]);
                const data = this.aduitsres;

                let workbook = new Workbook();
                let worksheet_1 = workbook.addWorksheet(
                    this.aduitsres[0].audit_uid + ' - Audit'
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
                    'Results_url',
                ];

                /*Define your column keys because this is what you use to insert your data according to your columns, they're column A, B, C, D respectively being idClient, Name, Tel, and Adresse.
    So, it's pretty straight forward */
                worksheet_1.columns = [
                    { key: 'Audit_ID', width: 20 },
                    { key: 'AB_ID', width: 20 },
                    { key: 'Audit_Name', width: 20 },
                    { key: 'BU_ID', width: 20 },
                    { key: 'AU_ID', width: 20 },
                    { key: 'Review_Year', width: 20 },
                    { key: 'Quarter', width: 20 },
                    { key: 'Start_Date', width: 20 },
                    { key: 'End_Date', width: 20 },
                    { key: 'Created_by', width: 20 },
                    { key: 'ACP_Audit', width: 20 },
                    { key: 'Last_Run', width: 20 },
                    { key: 'Results_url', width: 20 },
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
                        Results_url: item.results_url,
                    });
                });

                const data1 = this.auditPSelection;

                //   workbook = new Workbook();
                let worksheet_2 = workbook.addWorksheet('Audit Programs');

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
                    { key: 'AP_Name', width: 20 },
                    { key: 'AP_Desc', width: 20 },
                    { key: 'AU_ID', width: 20 },
                    { key: 'Last_Run', width: 20 },
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
                data1.forEach(function (item, index) {
                    worksheet_2.addRow({
                        AP_ID: item.audit_program_uid,
                        AP_Name: item.ap_name,
                        AP_Desc: item.ap_desc,
                        AU_ID: item.au_level_3_desc,
                        Last_Run: item.last_run,
                    });
                });

                let worksheet_3 = workbook.addWorksheet(
                    data1[i].audit_program_uid +
                        ' - Audit Test - ' +
                        data1[i].ap_name
                );

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
                    'results_url',
                ];

                /*Define your column keys because this is what you use to insert your data2 according to your columns, they're column A, B, C, D respectively being idClient, Name, Tel, and Adresse.
    So, it's pretty straight forward */
                worksheet_3.columns = [
                    { key: 'AuditTest_ID', width: 20 },
                    { key: 'AuditTest_Desc', width: 20 },
                    { key: 'Risk_ID', width: 20 },
                    { key: 'Risk_Desc', width: 20 },
                    { key: 'Control_ID', width: 20 },
                    { key: 'Control_Desc', width: 20 },
                    { key: 'Script_ID', width: 20 },
                    { key: 'Script_Desc', width: 20 },
                    //  { key: 'Script_SQL', width: 100 },
                    { key: 'Results', width: 20 },
                    { key: 'Notes', width: 20 },
                    { key: 'results_url', width: 20 },
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
                data2.forEach((item) => {
                    //  console.log(item);

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
                        results_url: item.target_table,
                    });

                    worksheet_3.getCell('K' + this.count).value = {
                        text: item.target_table,
                        hyperlink: '#' + item.target_table + '!A1',
                    };
                    this.count++;
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
                let x = [];
                for (var iii = 0; iii < data2.length; iii++) {
                    //    debugger;
                    // this.checktargettable(data2[i].target_table);
                    x.push('wwwwww');
                    if (x.indexOf(data2[iii].target_table) !== -1) {
                        //    alert('Value exists!');
                    } else {
                        // alert('Value does not exists!');
                        strexcel = data2[iii].audit_test_uid;

                        x.push(data2[iii].target_table);
                        this.checktargettables =
                            await this.auditService.checktargettablenew(
                                data2[iii].target_table
                            );
                        if (this.checktargettables.data == 1) {
                            this.targettablesnew =
                                await this.auditService.targettableatid(
                                    data2[iii].target_table,
                                    data2[iii].audit_test_uid
                                );
                            const header_5 =
                                this.targettablesnew.data.length > 0
                                    ? Object.keys(this.targettablesnew.data[0])
                                    : '';

                            const data5 =
                                this.targettablesnew.data.length > 0
                                    ? this.targettablesnew.data
                                    : [];

                            let worksheet_5 = workbook.addWorksheet(
                                data2[iii].target_table
                            );

                            if (this.targettablesnew.data.length > 0) {
                                let headerRow_5 = worksheet_5.addRow(header_5);
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

                            if (this.targettablesnew.data.length > 0) {
                                data5.forEach((d) => {
                                    let row = worksheet_5.addRow(
                                        Object.values(d)
                                    );

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

                                worksheet_5.getColumn(3).width = 20;
                                worksheet_5.addRow([]);
                            }
                        }
                    }
                }

                const ff = this.arrData;
                this.checktt = [];
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
                    this.loadingE = false;
                });
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
    }

    showScriptPopTitle;
    popupHeader;

    showScript(script, title) {
        // alert('hi');
        this.showScriptPopTitle = title;
        this.showScriptContent = script;
        this.showScriptPop = true;
    }

    getexce(apid: any) {
        // this.auditService
        //     .getExcelTestHistoryresult(0, apid)
        //     .pipe(
        //         map((resp) => any),
        //         catchError((err) => {
        //             this.messageService.add({
        //                 severity: 'error',
        //                 summary: 'ERROR!!',
        //                 detail: 'Something Went Wrong !!',
        //                 life: 3000,
        //             });
        //             // console.log(err);
        //             return throwError(err);
        //         }),
        //         finalize(() => {
        //             this.loadingT = false;
        //         })
        //     )
        //     .subscribe((res) => {
        //         res.map((res) => {
        //             res.record_status == 0
        //                 ? (res.record_status = false)
        //                 : (res.record_status = true);
        //             return res;
        //         });
        //         this.auditTexcel = res;
        //         this.loadingT = false;
        //     });
        // this.auditService
        //     .getExcelTestHistoryresult(0, apid)
        //     .subscribe((result: any) => {
        //         // console.log("audituniverse");
        //         // console.log(result);
        //         this.auditTexcel = result.data.data;
        //         this.loading = false;
        //     });
    }

    updateList(val) {
        //   debugger;
        this.selectedaudits = val;

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
}
