import { Component, OnInit, ViewChild } from '@angular/core';
import { TableList } from 'src/app/api/robotic-audit';
import { AuditService } from 'src/app/service/audit.service';
import { UploadService } from 'src/app/service/upload.service';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, throwError } from 'rxjs';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class UploadComponent implements OnInit {
    constructor(
        private auditService: AuditService,
        private uploadService: UploadService,
        private messageService: MessageService
    ) {}

    loading: boolean = false;
    username: string;
    guid;
    tableList: TableList[];
    selectedTable: TableList;
    tableData;
    tableCols = [];

    ngOnInit(): void {
        this.username = JSON.parse(
            window.atob(localStorage.getItem('jwt').split('.')[1])
        )['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];

        this.auditService.GetmastertableRequestnew('A').then((res) => {
            this.tableList = res.data;
        });
    }

    sendFile(event) {
        this.loading = true;
        let fileList: FileList = event.target.files;

        setTimeout(() => {
            this.loading = false;
        }, 1000);

        this.uploadService
            .sendFile(fileList)
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
                if (res.message == 'Success') {
                    this.uploadService
                        // .getUploadData(
                        //     this.selectedTable.tablename + '_massupload_stg'
                        // )
                        .getUploadData('risk_massupload_stg')
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
                            })
                        )
                        .subscribe((res) => {
                            if (res.message == 'Success') {
                                this.loading = false;
                                this.tableData = res.data;

                                Object.keys(this.tableData[0]).forEach(
                                    (ele) => {
                                        this.tableCols.push({
                                            field: ele,
                                            header: this.toTitleCase(
                                                ele.replace(/_/g, ' ')
                                            ),
                                        });
                                    }
                                );

                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'SUCCESS!!',
                                    detail: 'File send successfully!',
                                    life: 3000,
                                });
                            } else {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'ERROR!!',
                                    detail: 'Something Went Wrong !!',
                                    life: 3000,
                                });
                                this.loading = false;
                            }
                        });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!!',
                        detail: 'Something Went Wrong !!',
                        life: 3000,
                    });
                    this.loading = false;
                }
            });
    }

    upload() {
        this.loading = true;
        this.guid =
            'b' +
            this.username.toLowerCase().slice(0, 3) +
            moment(new Date()).format('DDMMYYHHmm');

        this.uploadService
            .uploadData(this.guid)
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
                console.log(res);
                if (res.message == 'success') {
                    this.uploadService
                        .getUploadStatus(this.guid)
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
                            })
                        )
                        .subscribe((res) => {
                            console.log(res);
                        });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!!',
                        detail: 'Something Went Wrong !!',
                        life: 3000,
                    });

                    this.loading = false;
                }
            });
    }

    toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
}
