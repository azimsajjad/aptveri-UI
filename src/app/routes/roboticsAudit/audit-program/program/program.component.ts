import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { catchError, finalize, forkJoin, map, throwError } from 'rxjs';
import { Audit, AuditProgram } from 'src/app/api/roboticsAudit/audit-program';
import { AuditService } from 'src/app/service/audit.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuditUniverseService } from 'src/app/service/audituniverseservice';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-program',
    templateUrl: './program.component.html',
    styleUrls: ['./program.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class ProgramComponent implements OnInit {
    @Input() auditId: number;
    @Output() auditProgramSelection = new EventEmitter<any>();

    showTable: boolean = true;
    loading: boolean = true;
    auditProgram: AuditProgram[] = [];
    auditPSelection: AuditProgram[];
    frequency: Frequency[];
    audit: Audit[];
    auditUniverse3;
    filteredAuditUniverse3;
    graphDialog: boolean = false;
    showGraph1: boolean = false;
    showGraph2: boolean = false;
    chartData1: any;
    chartData2: any;

    today: Date = new Date();

    auditProgramForm: FormGroup;

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

    constructor(
        private activatedRoute: ActivatedRoute,
        private auditService: AuditService,
        private auditUniverseService: AuditUniverseService,
        private _location: Location,
        private _formbuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        let audit = this.auditService
            .sendGetAuditRequest(this.auditId.toString())
            .pipe(
                map((resp) => resp['data']),
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
            );
        let pro = this.auditService.getAuditProgram(0, this.auditId);

        forkJoin([audit, pro]).subscribe((resp) => {
            resp[0].map((res) => {
                res.record_status == 0
                    ? (res.record_status = false)
                    : (res.record_status = true);
                return res;
            });
            this.audit = resp[0];

            let freq = this.auditService.getFrequency();
            let aul3 = this.auditUniverseService.getAuditUniverseLevel3(
                this.audit[0].au_level_2_id
            );

            forkJoin([freq, aul3]).subscribe((results) => {
                this.frequency = results[0].data;
                this.auditUniverse3 = results[1].data;
            });
            this.loading = false;
            this.auditProgram = resp[1].data;
        });
    }

    getAuditProgram() {
        this.auditService.getAuditProgram(0, this.auditId).subscribe((res) => {
            this.auditProgram = res.data;
        });
    }

    openP(auditProgram: AuditProgram) {
        this.auditProgramForm = this._formbuilder.group({
            audit_id: this.auditId,
            audit_program_id: auditProgram?.audit_program_id || null,
            ap_name: [auditProgram?.ap_name || null, Validators.required],
            ap_desc: [auditProgram?.ap_desc || null, Validators.required],
            au_level_3_id: [
                auditProgram
                    ? this.getAuditUniverse(auditProgram?.au_level_3_id)
                    : null,
                Validators.required,
            ],
            ap_schedule_date: [
                auditProgram ? new Date(auditProgram?.ap_schedule_date) : null,
            ],
            ap_schedule_time: [auditProgram?.ap_schedule_time || 0],
            frequency_id: [
                auditProgram
                    ? this.getFrequency(auditProgram?.frequency_id)
                    : null,
            ],
            next_run: [auditProgram ? new Date(auditProgram?.next_run) : null],
            last_run: [auditProgram ? new Date(auditProgram?.last_run) : null],
        });

        this.showTable = false;
    }

    saveAuditProgram() {
        this.auditProgramForm.value.frequency_id =
            this.auditProgramForm.value.frequency_id.codeId || 0;
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

        if (this.auditProgramForm.get('audit_program_id').value == null) {
            // add
            this.auditService
                .addAuditProgram(this.auditProgramForm.value)
                .pipe(
                    catchError((err) => {
                        this.showTable = true;
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
                        this.showTable = true;
                        this.loading = false;
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
                        this.showTable = true;
                        this.getAuditProgram();
                    }
                });
        } else {
            // edit
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
                        return throwError(err);
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.showTable = true;
                        this.loading = false;
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
                        this.showTable = true;
                        this.loading = false;
                        this.auditPSelection = null;
                        this.getAuditProgram();
                    }
                });
        }
    }

    runProgram() {}

    selectProgram() {
        this.auditProgramSelection.emit(this.auditPSelection);
    }

    changeStatus(program, event) {
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

    deleteProgram(ele) {
        this.confirmationService.confirm({
            header: 'Confirmation',
            message: 'Are you sure to delte this Program?',
            accept: () => {
                this.loading = true;
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
                                detail: 'Audit Program Deleted !!',
                                life: 3000,
                            });
                            this.getAuditProgram();
                            this.auditPSelection = null;
                        } else {
                            this.loading = false;
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

    getGraph(): void {
        const programId = this.auditPSelection.map(
            (element) => element.audit_program_id
        );

        this.auditService
            .getChart(programId)
            .pipe(
                catchError((err: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!!',
                        detail: 'Something Went Wrong !!',
                        life: 3000,
                    });
                    return throwError(err);
                })
            )
            .subscribe((res: any) => {
                const labels1: string[] = [];
                const labels2: string[] = [];
                const graphData1: number[] = [];
                const graphData2: number[] = [];

                res.data.forEach((element: any) => {
                    if (element.chartname === 'Excecution') {
                        labels1.push(element.resultname);
                        graphData1.push(element.result_count);
                        if (element.result_count > 0) this.showGraph1 = true;
                        this.chartData1 = {
                            labels: labels1,
                            datasets: [
                                {
                                    label: 'AP Level Graph',
                                    backgroundColor: ['#EB1D36', '#AB47BC'],
                                    data: graphData1,
                                },
                            ],
                        };
                    }

                    if (element.chartname === 'ExcecutionStatus') {
                        labels2.push(element.resultname);
                        graphData2.push(element.result_count);
                        if (element.result_count > 0) this.showGraph2 = true;
                        this.chartData2 = {
                            labels: labels2,
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

    // filters

    getFrequency(id: number) {
        if (id) return this.frequency?.find((res) => res.codeId == id);
        else return null;
    }

    // getFrequencyCode(val: String) {
    //     let f = this.frequency.find((res) => {
    //         return res.codeName == val;
    //     });

    //     return f?.codeId;
    // }

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

    getAuditUniverse(id: number) {
        let x = this.auditUniverse3.find((res) => {
            return res.au_level_3_id == id;
        });

        return x.au_level_3_uid + ' - ' + x.au_level_3_desc;
    }

    getAuditUniverseId(val: String) {
        let a = this.auditUniverse3.find((res) => {
            return res.au_level_3_desc == val.split(' - ')[1];
        });
        return a.au_level_3_id;
    }

    getTwoDigit(val) {
        return ('0' + val).slice(-2);
    }

    getLocalDateTime(time = null) {
        const today = new Date();
        const offset = today.getTimezoneOffset();
        const date = time
            ? new Date(moment(time).subtract(offset, 'minute').toISOString())
            : new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                  0,
                  0,
                  0
              );
        return date;
    }
}

interface Frequency {
    codeId: number;
    codeName: string;
}
