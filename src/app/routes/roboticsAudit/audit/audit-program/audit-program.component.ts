import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, finalize, forkJoin, throwError } from 'rxjs';
import { AuditProgram } from 'src/app/api/robotic-audit';
import { audit } from 'src/app/api/roboticsAudit/audit';
import { AuditService } from 'src/app/service/audit.service';
import { AuditUniverseService } from 'src/app/service/audituniverseservice';

@Component({
    selector: 'app-audit-program1',
    templateUrl: './audit-program.component.html',
    styleUrls: ['./audit-program.component.scss'],
})
export class AuditProgramComponent1 implements OnInit, OnChanges {
    @Input() audit: audit;
    @Output() auditProgramSelection = new EventEmitter<any>();

    showTable: boolean = true;
    graphDialog: boolean = false;
    loading: boolean = true;

    auditProgram: AuditProgram[];
    auditPSelection: AuditProgram[];
    frequency;
    auditUniverse3;
    filteredAuditUniverse3;

    auditProgramForm: FormGroup;

    showGraph1: boolean = false;
    showGraph2: boolean = false;
    chartData1: any;
    chartData2: any;

    items: MenuItem[];

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
        private auditService: AuditService,
        private auditUniverseService: AuditUniverseService,
        private _formbuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.items = [
            {
                icon: 'pi pi-plus',
                command: () => {
                    this.openP(null);
                },
            },
            {
                icon: 'pi pi-play',
                command: () => {
                    this.runProgram();
                },
                disabled: true,
            },
            {
                icon: 'pi pi-chart-pie',
                command: () => {
                    this.getGraph();
                },
                disabled: true,
            },
        ];
    }

    ngOnChanges(): void {
        if (this.audit) {
            this.getAuditProgram();

            let freq = this.auditService.getFrequency();
            let aul3 = this.auditUniverseService.getAuditUniverseLevel3(
                this.audit.au_level_2_id
            );

            forkJoin([freq, aul3]).subscribe((results) => {
                this.frequency = results[0].data;
                this.auditUniverse3 = results[1].data;
            });
        }

        this.auditPSelection = null;
        this.auditProgramSelection.emit(null);
    }

    getAuditProgram() {
        this.auditService
            .getAuditProgram(0, this.audit.audit_id)
            .subscribe((res) => {
                this.auditProgram = res.data;
                this.loading = false;
            });
    }

    selectProgram(ele) {
        this.auditPSelection = [ele];

        this.auditProgramSelection.emit(this.auditPSelection);

        this.items = [
            {
                icon: 'pi pi-plus',
                command: () => {
                    this.openP(null);
                },
            },
            {
                icon: 'pi pi-play',
                command: () => {
                    this.runProgram();
                },
                disabled: this.auditPSelection?.length == 0,
            },
            {
                icon: 'pi pi-chart-pie',
                command: () => {
                    this.getGraph();
                },
                disabled: this.auditPSelection?.length == 0,
            },
        ];
    }

    openP(auditProgram: AuditProgram) {
        this.auditProgramForm = this._formbuilder.group({
            audit_id: this.audit.audit_id,
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

        this.showTable = false;
    }

    saveAuditProgram() {
        this.auditProgramForm.value.frequency_id =
            this.auditProgramForm.value.frequency_id?.codeId || 0;
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

                        return throwError(err);
                    }),
                    finalize(() => {
                        this.loading = false;
                        this.showTable = true;
                        this.getAuditProgram();
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'New Audit Program Created !!',
                            life: 3000,
                        });
                    } else {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'INFO !!',
                            detail: res.message,
                            life: 3000,
                        });
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
                    }),
                    finalize(() => {
                        this.loading = false;
                        this.auditPSelection = null;
                        this.showTable = true;
                        this.getAuditProgram();
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
                    } else {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'INFO !!',
                            detail: res.message,
                            life: 3000,
                        });
                    }
                });
        }
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
            message: 'Are you sure to delete this Program?',
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

    runProgram() {}

    // filters...

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

    getFrequency(id: number) {
        if (id) return this.frequency?.find((res) => res.codeId == id);
        else return null;
    }

    getTwoDigit(val) {
        return ('0' + val).slice(-2);
    }

    clear(table: Table) {
        table.clear();
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
