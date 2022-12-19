import { Component, ElementRef, OnInit, Input, ViewChild } from '@angular/core';
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
import { Location } from '@angular/common';

import {
    catchError,
    debounceTime,
    finalize,
    forkJoin,
    map,
    throwError,
} from 'rxjs';
@Component({
    selector: 'app-view-result',
    templateUrl: './view-result.component.html',
    styleUrls: ['./view-result.component.scss'],
    providers: [MessageService, ConfirmationService],
    styles: [
        `
            :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
                position: -webkit-sticky;
                position: sticky;
                top: 5rem;
            }

            .layout-news-active :host ::ng-deep .p-datatable tr > th {
                top: 7rem;
            }
            .ui-table-scrollable-header-box {
                margin-right: 17px !important;
            }

            .ui-table-scrollable-body {
                margin-right: 17px !important;
            }
            ///// this code below is for width of the scroll bar
            ::-webkit-scrollbar {
                width: 10px;
            }
            .ui-table-scrollable-header {
                overflow-y: scroll;
            }
        `,
    ],
})
export class ViewResultComponent implements OnInit {
    @Input() dataMessageResults: any[];
    res_target_table;
    targettables: any[];
    exltargettables: any[];
    loading: boolean = true;
    loadingE: boolean = false;
    datetime = new Date();
    validatedata: boolean = false;
    showdata: boolean = false;
    topdata: boolean = false;
    cols: any[];
    auditTHname;
    adthexcel;

    constructor(
        private auditService: AuditService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public accountSvr: AuthService,
        private http: HttpClient,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public ete: ExportExcelService,
        private _location: Location
    ) {
        // debugger;
        this.activatedRoute.params.subscribe((res) => {
            //   debugger;
            this.res_target_table = atob(res.target_table);
            this.auditTHname = atob(res.auditTHname);
            //this.auditTSelection = +atob(res.audit_id);
        });
    }

    ngOnInit(): void {
        //  debugger;
        this.gettargettable(this.res_target_table, this.auditTHname);
        // this.gettargettableexp(this.res_target_table);
    }
    getHeaders() {
        this.dataMessageResults = this.targettables;
        let headers: string[] = [];
        if (this.dataMessageResults) {
            this.dataMessageResults.forEach((value) => {
                Object.keys(value).forEach((key) => {
                    if (!headers.find((header) => header == key)) {
                        headers.push(key);
                    }
                });
            });
        }
        return headers;
    }

    backClicked() {
        this._location.back();
    }

    gettargettable(id: string, auditthid: string) {
        this.auditService
            .sendGettargettblRequest(id, auditthid)
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
                this.targettables = res;
                const slicedArray = this.targettables.slice(0, 100);

                //this.targettables = this.targettables];
                this.cols = Object.keys(this.targettables[0]);
                if (this.targettables.length > 0) {
                    if (this.targettables.length > 100) {
                        this.topdata = true;
                    } else {
                        this.topdata = false;
                    }
                    this.validatedata = true;
                    this.showdata = false;
                } else {
                    this.validatedata = false;
                    this.showdata = true;
                }
                // console.log(res);
            });
    }

    gettargettableexp(id: string) {
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
                this.exltargettables = res;
                const slicedArray = this.exltargettables.slice(0, 100);
                this.targettables = slicedArray;
                //this.targettables = this.targettables];
                this.cols = Object.keys(this.exltargettables[0]);
                // if (this.targettables.length > 0) {
                //     this.validatedata = true;
                //     this.showdata = false;
                // } else {
                //     this.validatedata = false;
                //     this.showdata = true;
                // }
                // console.log(res);
            });
    }
    donwnloadExcel() {
        this.confirmationService.confirm({
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            message: 'Downloading will take time. Do you want to continue?',
            accept: () => {
                this.exportResultToExcel();
            },
        });
    }

    downloadExcel() {
        this.confirmationService.confirm({
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            message: 'Downloading will take time. Do you want to continue?',
            accept: () => {
                this.exportResultToExcel();
            },
        });
    }

    async exportResultToExcel() {
        //   debugger;
        this.loadingE = true;
        const title = this.res_target_table;

        this.adthexcel = await this.auditService.TargetTbladh(
            this.res_target_table,
            this.auditTHname
        );
        const data2 = this.adthexcel.data;
        const header_1 = Object.keys(this.adthexcel.data[0]);
        //  const header_2 = Object.keys(this.auditPSelection[0]);
        // const header_3 = Object.keys(this.auditT[0]);
        //  const header_4 = Object.keys(this.auditTH[0]);
        const data = this.adthexcel.data;
        //   const data2 = this.auditPSelection;
        //    const data3 = this.auditT;
        //   const data4 = this.auditTH;
        //Create a workbook with a worksheet
        let workbook = new Workbook();
        let worksheet_1 = workbook.addWorksheet(this.res_target_table);
        //let workbook = new Workbook();
        //  let worksheet_2 = workbook.addWorksheet('Audit Programs');

        //  let worksheet_3 = workbook.addWorksheet('Audit Test');

        //  let worksheet_4 = workbook.addWorksheet('Audit Test History');

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

        // let headerRow_2 = worksheet_2.addRow(header_2);
        // headerRow_2.eachCell((cell, number) => {
        //     cell.fill = {
        //         type: 'pattern',
        //         pattern: 'solid',
        //         fgColor: { argb: '4167B8' },
        //         bgColor: { argb: '' },
        //     };
        //     cell.font = {
        //         bold: true,
        //         color: { argb: 'FFFFFF' },
        //         size: 12,
        //     };
        // });

        // let headerRow_3 = worksheet_3.addRow(header_3);
        // headerRow_3.eachCell((cell, number) => {
        //     cell.fill = {
        //         type: 'pattern',
        //         pattern: 'solid',
        //         fgColor: { argb: '4167B8' },
        //         bgColor: { argb: '' },
        //     };
        //     cell.font = {
        //         bold: true,
        //         color: { argb: 'FFFFFF' },
        //         size: 12,
        //     };
        // });

        // let headerRow_4 = worksheet_4.addRow(header_4);
        // headerRow_4.eachCell((cell, number) => {
        //     cell.fill = {
        //         type: 'pattern',
        //         pattern: 'solid',
        //         fgColor: { argb: '4167B8' },
        //         bgColor: { argb: '' },
        //     };
        //     cell.font = {
        //         bold: true,
        //         color: { argb: 'FFFFFF' },
        //         size: 12,
        //     };
        // });

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

        // data2.forEach((d) => {
        //     let row = worksheet_2.addRow(Object.values(d));

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
        //   });

        // worksheet_2.getColumn(3).width = 20;
        // worksheet_2.addRow([]);

        // data3.forEach((d) => {
        //     let row = worksheet_3.addRow(Object.values(d));

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
        //  });

        // worksheet_3.getColumn(3).width = 20;
        // worksheet_3.addRow([]);

        // data4.forEach((d) => {
        //     let row = worksheet_4.addRow(Object.values(d));

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
        //  });

        // worksheet_4.getColumn(3).width = 20;
        // worksheet_4.addRow([]);

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
            this.loadingE = false;
        });
    }
}
