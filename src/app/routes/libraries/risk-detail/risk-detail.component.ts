import {
    Component,
    OnInit,
    ViewChild,
    ChangeDetectorRef,
    ElementRef,
} from '@angular/core';
import { risk, auditunivthird } from '../../../api/libraries';
import { BannerService } from '../../../service/librariesservice';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from '../../../service/auth.service';
import {
    catchError,
    debounceTime,
    finalize,
    forkJoin,
    map,
    throwError,
} from 'rxjs';
import {
    FormControl,
    FormGroup,
    Validators,
    FormBuilder,
    ValidatorFn,
    AbstractControl,
} from '@angular/forms';
import { Dialog } from 'primeng/dialog';
@Component({
    selector: 'app-risk-detail',
    templateUrl: './risk-detail.component.html',
    providers: [MessageService, ConfirmationService],

    styleUrls: ['./risk-detail.component.scss'],
})
export class RiskDetailComponent implements OnInit {
    riskDialog: boolean;
    form: FormGroup;
    deleteriskDialog: boolean = false;

    deleterisksDialog: boolean = false;
    output: string[];
    risks: risk[];
    auditunivthird: auditunivthird[];
    filteredRiskExposure: any[];
    RiskExposure: any[];
    filteredRisktaxone: any[];
    Risktaxone: any[];
    filteredAuThird: any[];
    AuThird: any[];
    filteredRisktaxtwo: any[];
    Risktaxtwo: any[];
    datarisks: risk;
    selectedau_level_3_uid: any[];
    risk: risk;
    loading: boolean = true;
    filteredAuThirdSingle: any[];
    AuThirdSingle: any[];
    selectedrisks: risk[];
    filteredimpact: any[];
    impact: any[];
    filteredlikelihood: any[];
    likelihood: any[];
    selectedaudit3: any;
    selectedrtax1: any;
    selectedrtax2: any;
    selectedexpore: any;
    selectedimpact: any = 0;
    selectedlikelihood: any = 0;
    selectedtotal: any = 0;

    submitted: boolean;
    showPopupText: boolean = false;
    textDialogForm: FormGroup;
    popupText;
    showPop;
    showPopTitle;
    showContent;

    @ViewChild('textDialog') textDialog: Dialog;

    cols: any[];
    @ViewChild('dt1') table: Table;

    @ViewChild('filter') filter: ElementRef;
    @ViewChild('submitButton') submitButton: ElementRef;

    statuses: any[];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private fb: FormBuilder,
        private riskService: BannerService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public accountSvr: AuthService
    ) {}

    ngOnInit() {
        //   this.getRiskExposuretype();
        //   this.getAuThirdtype();
        this.form = this.fb.group({
            auldesc: [
                '',
                Validators.compose([
                    Validators.required,

                    Validators.minLength(1),
                ]),
            ],
            process: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],

            business_objective: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
            comment: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
            risk: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
            rtonedesc: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
            rttwodesc: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
            coddesc: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
            impact: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
            likelihood: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
        });
        this.getrisk();
        // this.getRisktaxoneControltype();
        // this.getimpactControltype();
        //debugger;
        let ban = this.riskService.sendGetauditunivthirdRequest();
        let ri = this.riskService.sendGetloadRiskExposuretypeRequest();
        let cont = this.riskService.sendGetloadRisktaxoneRequest();
        let aud = this.riskService.sendGetloadimpactRequest();

        forkJoin([ban, ri, cont, aud]).subscribe((results) => {
            this.AuThird = results[0].data;
            this.RiskExposure = results[1].data;
            this.Risktaxone = results[2].data;
            this.impact = results[3].data;
            this.likelihood = results[3].data;
        });

        this.cols = [
            { field: 'audit_uid', header: 'audit ID' },
            { field: 'division', header: 'Division' },
            { field: 'audit', header: 'audit' },
        ];

        this.form.get('rtonedesc').valueChanges.subscribe((res) => {
            if (res == '') {
                this.selectedrtax1 = null;
            }
        });
    }

    getAuThirdtype() {
        this.riskService
            .sendGetauditunivthirdRequest()
            .subscribe((result: any[]) => {
                //  console.log(result);
                //    this.AuThirdSingle= result;
                this.AuThird = result;
                this.loading = false;
            });
    }

    getRisktaxoneControltype() {
        this.riskService
            .sendGetloadRisktaxoneRequest()
            .subscribe((result: any[]) => {
                //   console.log(result);

                this.Risktaxone = result;
                this.loading = false;
            });
    }

    getRisktaxtwoControltype() {
        // this.riskService.sendGetloadRisktaxtwoRequest(this.selectedrtax1).subscribe((result: any[])=>{
        //   //  console.log(result);

        //       this.Risktaxtwo = result;
        //       this.loading = false;

        //     })
        //  this.selectedrtax2 = '';
        //   this.Risktaxtwo = [];

        if (this.selectedrtax1 > 0) {
            this.riskService
                .sendGetloadRisktaxtwoRequest(this.selectedrtax1)
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
                    this.Risktaxtwo = res;
                });
        } else {
            this.filteredRisktaxtwo = [];
            this.Risktaxtwo = [];
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message!!',
                detail: 'Select Risk Category First',
                life: 3000,
            });
        }
    }

    filterRisktaxtwo(event) {
        //  debugger;

        this.getRisktaxtwoControltype();
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.Risktaxtwo.length; i++) {
            const Risktaxtwo = this.Risktaxtwo[i];
            if (
                Risktaxtwo.rt_level_2_uid
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1 ||
                Risktaxtwo.rt_descrption
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1
            ) {
                //  filtered.push(Risktaxtwo);
                filtered.push(
                    Risktaxtwo.rt_level_2_uid + '-' + Risktaxtwo.rt_descrption
                );
            }
        }
        this.filteredRisktaxtwo = filtered;
    }

    filterRisktaxone(event) {
        //  debugger;
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.Risktaxone.length; i++) {
            const Risktaxone = this.Risktaxone[i];
            if (
                Risktaxone.rt_level_1_uid
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1 ||
                Risktaxone.rt_descrption
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1
            ) {
                // filtered.push(Risktaxone);//  rt_level_1_uid
                filtered.push(
                    Risktaxone.rt_level_1_uid + ' - ' + Risktaxone.rt_descrption
                );
            }
        }
        this.filteredRisktaxone = filtered;
    }

    getrisk() {
        //debugger;
        // this.riskService.sendGetriskRequest().subscribe((result: any[])=>{
        // //   console.log(result);

        //     this.risks = result;
        //     this.loading = false;

        //   })

        this.riskService
            .sendGetriskRequest()
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
                //console.log(res);
                this.risks = res;
                //console.log(res)
            });
    }

    getimpactControltype() {
        this.riskService
            .sendGetloadimpactRequest()
            .subscribe((result: any[]) => {
                // console.log(result);

                this.impact = result;
                this.likelihood = result;
                this.loading = false;
            });
    }

    filterimpact(event) {
        //debugger;
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.impact.length; i++) {
            const impact = this.impact[i];
            if (
                impact.code_value_key
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0 ||
                impact.text_code_value
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                //filtered.push(impact);
                filtered.push(impact.text_code_value);
            }
        }
        this.filteredimpact = filtered;
    }

    filterlikelihood(event) {
        //debugger;
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.likelihood.length; i++) {
            const likelihood = this.likelihood[i];
            if (
                likelihood.code_value_key
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0 ||
                likelihood.text_code_value
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                //filtered.push(impact);
                filtered.push(likelihood.text_code_value);
            }
        }
        this.filteredlikelihood = filtered;
    }

    filterAuThirdSingle(event) {
        this.filteredAuThirdSingle = this.filterAuThirds(
            event.query,
            this.AuThirdSingle
        );
    }

    filterAuThirds(query, AuThirdSingle: any[]): any[] {
        //    debugger;
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered: any[] = [];

        for (let i = 0; i < this.AuThirdSingle.length; i++) {
            let country = this.AuThirdSingle[i];
            //   if (country.au_level_3_uid.toLowerCase().indexOf(query.toLowerCase()) == 0 || country.au_level_3_desc.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            //     filtered.push(country);
            //   }
            if (
                country.au_level_3_desc
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                filtered.push(
                    country.au_level_3_uid + ' - ' + country.au_level_3_desc
                );
            }
        }
        //console.log(filtered);
        return filtered;
    }

    filterAuThird(event) {
        // debugger;
        const filtered: any[] = [];
        const filteredall: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.AuThird.length; i++) {
            const AuThird = this.AuThird[i];
            if (
                AuThird.au_level_3_desc
                    .toString()
                    .toLowerCase()
                    .includes(query.toLowerCase()) ||
                AuThird.au_level_3_uid
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0 ||
                AuThird.au_level_3_id
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                filtered.push(
                    AuThird.au_level_3_uid + ' - ' + AuThird.au_level_3_desc
                );
                //  filtered.push(AuThird);
                filteredall.push(AuThird);
            }
        }
        //const result = (<any>this.filteredAuThird).filter(option => option.au_level_3_uid.includes(event.query));

        this.filteredAuThird = filtered;
        // this.output = this.AuThird.filter(c => c.startsWith(event.query));

        // this.AuThird.getResults(event.query).then(data => {
        //     this.output = data;
        // });
    }
    getRiskExposuretype() {
        this.riskService
            .sendGetloadRiskExposuretypeRequest()
            .subscribe((result: any[]) => {
                //  console.log(result);

                this.RiskExposure = result;
                this.loading = false;
            });
    }

    test() {
        // alert("hi");
    }

    filterRiskExposure(event) {
        //  debugger;
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.RiskExposure.length; i++) {
            const RiskExposure = this.RiskExposure[i];
            if (
                RiskExposure.text_code_value
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                //   filtered.push(RiskExposure);
                //  filtered.push(RiskExposure.code_value_key + ' - ' + RiskExposure.text_code_value);
                filtered.push(RiskExposure.text_code_value);
            }
        }

        this.filteredRiskExposure = filtered;
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    openNew() {
        this.risk = {};
        this.selectedaudit3 = '';

        this.selectedrtax1 = '';
        this.selectedrtax2 = '';
        this.selectedexpore = '';
        this.selectedimpact = '';
        this.selectedlikelihood = '';
        this.selectedtotal = '';
        this.submitted = false;
        this.riskDialog = true;
    }

    deleteSelectedrisks() {
        // this.deleterisksDialog = true;
        this.confirmationService.confirm({
            header: 'Confirmation!',
            message: 'Are you sure you want to delete selected Risk?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.confirmDeleteSelected();
            },
            reject: () => {
                //  console.log('rejected');
            },
        });
    }

    editrisk(risk: risk) {
        //   debugger;
        //  this.risk = {...risk};
        this.riskDialog = true;
        const arrayToObject = Object.assign({}, ...this.selectedrisks);
        this.risk = { ...arrayToObject };
        //  this.selectedtotal=parseInt(this.risk.impact) * parseInt(this.risk.likelihood);

        // this.risks.push(this.risk);
        this.selectedaudit3 = this.risk.au_level_3_uid;

        this.selectedrtax1 = this.risk.rtaxval1;
        this.selectedrtax2 = this.risk.rtaxval2;
        this.selectedexpore = this.risk.risk_exposure;
        this.selectedimpact = this.risk.impact;
        this.selectedlikelihood = this.risk.likelihood;

        this.selectedtotal = this.risk.risk_score;

        this.getRisktaxtwoControltype();
    }

    deleterisk(risk: risk) {
        this.deleteriskDialog = true;
        this.risk = { ...risk };
    }

    confirmDeleteSelected() {
        this.deleterisksDialog = false;
        // this.risks = this.risks.filter(val => !this.selectedrisks.includes(val));
        // this.messageService.add({severity: 'success', summary: 'Successful', detail: 'risks Deleted', life: 3000});
        // // this.selectedrisks = null;

        const arrayToObject = Object.assign({}, ...this.selectedrisks);
        this.risk = { ...arrayToObject };

        this.riskService
            .sendDeleteriskRequest(this.risk.risk_uid)
            .pipe(
                catchError((err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!!',
                        detail: 'Something Went Wrong !!',
                        life: 3000,
                    });
                    //    this.selectedrisks = null;
                    this.risk = {};
                    this.selectedrisks = null;
                    //    console.log(err);
                    return throwError(err);
                })
            )
            .subscribe((res) => {
                if (res.message == 'Success') {
                    this.getrisk();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success!!',
                        detail: 'Risk Deleted !!',
                        life: 3000,
                    });
                    this.selectedrisks = null;
                    this.risk = {};
                } else {
                    this.getrisk();
                    this.selectedrisks = null;
                    this.risk = {};
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Warn Message!!',
                        detail: res.message,
                        life: 3000,
                    });
                }
            });

        // this.banners = this.banners.filter(val => !this.selectedBanners.includes(val));
        // this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Banners Deleted', life: 3000});
        //     this.riskService.sendDeleteriskRequest(this.risk.risk_uid).subscribe(
        //       res => {
        //        // console.log(res);
        //         if(res > 0)
        //         {
        //           this.getrisk();
        //           this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Risks Deleted', life: 3000});
        //           this.risk = {};          }
        //       }
        // );

        //     this.selectedrisks = null;

        // this.riskService
        //     .sendDeleteriskRequest(this.risk.risk_uid)
        //     .pipe(
        //         catchError((err) => {
        //             this.messageService.add({
        //                 severity: 'error',
        //                 summary: 'ERROR!!',
        //                 detail: 'Something Went Wrong !!',
        //                 life: 3000,
        //             });
        //             //   console.log(err);
        //             return throwError(err);
        //         }),
        //         finalize(() => {
        //             this.getrisk();
        //             this.selectedrisks = null;
        //             this.risk = {};
        //             //this.scriptDialog = false;
        //             this.loading = false;
        //             this.messageService.add({
        //                 severity: 'success',
        //                 summary: 'Successful',
        //                 detail: 'Risk Deleted !!',
        //                 life: 3000,
        //             });
        //         })
        //     )
        //     .subscribe();
    }

    confirmDelete() {
        this.deleteriskDialog = false;
        //  this.risks = this.risks.filter(val => val.id !== this.risk.id);
        this.riskService
            .sendDeleteRequest(this.risk.risk_uid)
            .subscribe((res) => {
                //   console.log(res);
                if (res > 0) {
                    this.getrisk();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'risk Deleted',
                        life: 3000,
                    });
                    this.risk = {};
                }
            });
    }

    hideDialog() {
        this.riskDialog = false;
        this.submitted = false;
    }

    saverisk() {
        //  debugger;
        this.submitButton.nativeElement.disabled = true;

        this.submitted = true;
        //alert(this.selectedau_level_3_uid);
        this.datarisks = {};
        if (this.risk.process.trim()) {
            if (this.risk.risk_uid) {
                // @ts-ignore
                //   this.risk.inventoryStatus = this.risk.inventoryStatus.value ? this.risk.inventoryStatus.value: this.risk.inventoryStatus;
                // this.risks[this.findIndexById(this.risk.risk_uid)] = this.risk;
                this.risk.process = this.risk.process;
                this.risk.risk = this.risk.risk;
                // this.risks.push(this.risk);
                this.datarisks.process = this.risk.process;
                this.datarisks.au_level_3_uid = this.selectedaudit3;
                this.datarisks.business_objective =
                    this.risk.business_objective;
                this.datarisks.comment = this.risk.comment;
                this.datarisks.risk = this.risk.risk;
                this.datarisks.rtax1 = this.selectedrtax1;
                this.datarisks.rtax2 = this.selectedrtax2;
                this.datarisks.risk_exposure = this.selectedexpore;
                this.datarisks.impact = this.selectedimpact;
                this.datarisks.likelihood = this.selectedlikelihood;
                this.datarisks.risk_score = this.selectedtotal;
                this.datarisks.risk_uid = this.risk.risk_uid;
                //     this.riskService.sendPutRiskRequest(this.datarisks).subscribe(
                //         res => {
                //       //    console.log(res);
                //           if(res > 0)
                //           {
                //             this.getrisk();
                //             this.messageService.add({severity: 'success', summary: 'Successful', detail: 'risk Updated', life: 3000});
                //             this.selectedrisks=null
                //           }
                //         }
                //   );

                this.riskService
                    .sendPutRiskRequest(this.datarisks)
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
                        }),
                        finalize(() => {
                            this.selectedrisks = null;
                        })
                    )
                    .subscribe((res) => {
                        if (res.data) {
                            this.getrisk();
                            this.selectedrisks = null;

                            //this.scriptDialog = false;
                            this.loading = false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Risk Updated !!',
                                life: 3000,
                            });
                        } else {
                            this.getrisk();
                            this.selectedrisks = null;

                            //this.scriptDialog = false;
                            this.loading = false;
                            this.messageService.add({
                                severity: 'error',
                                summary: 'ERROR!!',
                                detail: 'Something Went Wrong !!',
                                life: 3000,
                            });
                        }
                    });
            } else {
                //  this.risk.risk_uid = this.createId();
                // this.risk.code = this.createId();
                // this.risk.image = 'risk-placeholder.svg';
                // @ts-ignore
                this.risk.process = this.risk.process;
                this.risk.risk = this.risk.risk;
                // this.risks.push(this.risk);
                this.datarisks.process = this.risk.process;
                this.datarisks.au_level_3_uid = this.selectedaudit3;
                this.datarisks.business_objective =
                    this.risk.business_objective;
                this.datarisks.comment = this.risk.comment;
                this.datarisks.risk = this.risk.risk;
                this.datarisks.rtax1 = this.selectedrtax1;
                this.datarisks.rtax2 = this.selectedrtax2;
                this.datarisks.risk_exposure = this.selectedexpore;
                this.datarisks.impact = this.selectedimpact;
                this.datarisks.likelihood = this.selectedlikelihood;
                this.datarisks.risk_score = this.selectedtotal;

                this.riskService
                    .sendPostRiskRequest(this.datarisks)
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
                        if (res.data) {
                            this.getrisk();
                            // this.selectedrisks = null;

                            //this.scriptDialog = false;
                            this.loading = false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'New Risk Added !!',
                                life: 3000,
                            });
                        } else {
                            this.getrisk();
                            // this.selectedrisks = null;

                            //this.scriptDialog = false;
                            this.loading = false;
                            this.messageService.add({
                                severity: 'error',
                                summary: 'ERROR!!',
                                detail: 'Something Went Wrong !!',
                                life: 3000,
                            });
                        }
                    });

                //     this.riskService.sendPostRiskRequest(this.datarisks).subscribe(
                //         res => {
                //        //   console.log(res);
                //           if(res > 0)
                //           {
                //             this.getrisk();
                //             this.messageService.add({severity: 'success', summary: 'Successful', detail: 'risk Created', life: 3000});
                //           }
                //         }
                //   );
            }

            this.risks = [...this.risks];
            this.riskDialog = false;
            this.risk = {};
        }
        this.submitButton.nativeElement.disabled = false;
    }
    selectEngineeringDisplayName(event: any) {
        //  debugger;
        // this.userData=event;
        //  this.kickOffConceptInstance.bbEngineering=event.displayName;
        //  this.kickOffConceptInstance.bbEngineeringEmail=event.emailID;
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.risks.length; i++) {
            if (this.risks[i].risk_uid === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    doOnSelectaudit3(event) {
        let x = this.AuThird.filter((ele) => {
            return ele.au_level_3_uid == event.split(' - ')[0];
        });
        this.selectedaudit3 = x[0].au_level_3_id.toString();
    }

    doOnSelectrtax1(event) {
        let x = this.Risktaxone.filter((ele) => {
            return ele.rt_level_1_uid == event.split(' - ')[0];
        });
        this.selectedrtax1 = x[0].rt_level_1_id.toString();
        this.getRisktaxtwoControltype();
        this.form.get('rttwodesc').setValue(null);
    }
    doOnSelectrtax2(event) {
        let x = this.Risktaxtwo.filter((ele) => {
            return ele.rt_level_2_uid == event.split('-')[0];
        });
        this.selectedrtax2 = x[0].rt_level_2_id.toString();
    }

    doOnSelectexposure(event) {
        let result = this.RiskExposure.filter((ele) => {
            return ele.text_code_value == event;
        });
        this.selectedexpore = result[0].code_value_key;
    }

    doOnSelectimpact(event) {
        //  console.log(event);
        const str = event;
        const result = str.split('-');
        this.selectedimpact = str[0];
        this.selectedtotal = this.selectedlikelihood * this.selectedimpact;
        //  console.log(result);
    }

    doOnSelectlikelihood(event) {
        //  debugger;
        //   console.log(event);
        const str = event;
        const result = str.split('-');
        this.selectedlikelihood = str[0];
        this.selectedtotal = this.selectedlikelihood * this.selectedimpact;
        //    console.log(result);
    }

    popupHeader;

    getText(val, _formGroup: FormGroup, _formControlName, title) {
        this.popupHeader = title;
        this.textDialogForm = this.fb.group({
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

    selectRisk(risk) {
        this.selectedrisks = [risk];
    }

    showInDetail(detail, title) {
        this.showPop = true;
        this.showPopTitle = title;
        this.showContent = detail;
    }
}
