import {
    Component,
    OnInit,
    ViewChild,
    ChangeDetectorRef,
    ElementRef,
} from '@angular/core';
import { control } from '../../../api/libraries';
import { BannerService } from '../../../service/librariesservice';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/service/auth.service';
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
import { AuditUniverseService } from 'src/app/service/audituniverseservice';

@Component({
    selector: 'app-control-detail',
    templateUrl: './control-detail.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./control-detail.component.scss'],
})
export class ControlDetailComponent implements OnInit {
    controlDialog: boolean;
    form: FormGroup;

    deletecontrolDialog: boolean = false;

    deletecontrolsDialog: boolean = false;

    controls: control[];

    datacontrols: control;

    control: control;
    loading: boolean = true;

    selectedcontrols: control[];

    submitted: boolean;
    filteredkeycontrol: any[];
    keycontrol: any[];
    filteredBanner: any[];
    Banner: any[];
    filteredkeyassertion: any[];
    keyassertion: any[];

    filteredRisk: any[];
    Risk: any[];

    filteredkeyCategory: any[];
    keyCategory: any[];

    filteredkeyType: any[];
    keyType: any[];
    selectedItem: any = [];
    selectedcatItem: any = [];
    filteredkeyFrequency: any[];
    keyFrequency: any[];
    selectedraudit: any;
    selectedrbanner: any;
    selectedrrisk: any;
    selectedrcategory: any;
    selectedrcontrol: any;
    selectedrfrequency: any;
    selectedrassertion: any;
    selectedrautomation: any;
    selectedrkey: any;
    filteredkeyControltype: any[];
    keyControltype: any[];

    categoryselected?: string;
    controlselected?: string;
    frequencyselected?: string;
    autoselected?: string;
    assselected?: string;
    keyselected?: string;
    aulfselected?: string;
    bannerselected?: string;
    riskselected?: string;
    showPopupText: boolean = false;
    textDialogForm: FormGroup;
    popupText;

    @ViewChild('textDialog') textDialog: Dialog;

    filteredAuditunivfour: any[];
    Auditunivfour: any[];

    cols: any[];
    @ViewChild('dt1') table: Table;

    @ViewChild('filter') filter: ElementRef;

    @ViewChild('submitButton') submitButton: ElementRef;

    statuses: any[];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private fb: FormBuilder,
        private controlService: BannerService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public accountSvr: AuthService,
        private auditUniverseSerive: AuditUniverseService
    ) {}

    ngOnInit() {
        this.form = this.fb.group({
            aulfdesc: [
                '',
                Validators.compose([
                    Validators.required,

                    Validators.minLength(1),
                ]),
            ],
            bannerdesc: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],

            riskdesc: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
            control: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
            comments: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
            controldesc: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
            frequencydesc: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
            autodesc: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
            categorydesc: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
            assdesc: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
            keydesc: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
        });
        this.getcontrol();

        // this.getBannertype();
        // this.getRisktype();
        // this.getkeycontroltype();
        // this.getkeyassertiontype();
        // this.getkeyCategorytype();
        // this.getkeyTypetype();
        // this.getkeyFrequencyFrequency();
        // this.getkeyControltypeControltype();
        // this.getAuditunivfourControltype();
        // debugger;
        let ban = this.controlService.sendGetRequest();
        let ri = this.controlService.sendGetriskRequest();
        let cont = this.controlService.sendGetloadKeyControlRequest();
        let aud = this.controlService.sendGetloadKeyassertionRequest();
        let cat = this.controlService.sendGetloadKeyCategoryRequest();
        let key = this.controlService.sendGetloadKeyTypeRequest();
        let freq = this.controlService.sendGetloadKeyFrequencyRequest();
        let ctype = this.controlService.sendGetloadKeyControltypeRequest();
        let auni = this.controlService.sendGetloadAuditunivfourRequest();

        forkJoin([ban, ri, cont, aud, cat, key, freq, ctype, auni]).subscribe(
            (results) => {
                this.Banner = results[0].data;
                this.Risk = results[1].data;
                this.keycontrol = results[2].data;
                this.keyassertion = results[3].data;
                this.keyCategory = results[4].data;
                this.keyType = results[5].data;
                this.keyFrequency = results[6].data;
                this.keyControltype = results[7].data;
                this.Auditunivfour = results[8].data;
            }
        );

        this.cols = [
            { field: 'control_uid', header: 'control ID' },
            { field: 'division', header: 'Division' },
            { field: 'control', header: 'control' },
        ];
    }

    getkeycontroltype() {
        this.controlService
            .sendGetloadKeyControlRequest()
            .subscribe((result: any[]) => {
                //     console.log(result);

                this.keycontrol = result;
                this.loading = false;
            });
    }

    getRisktype() {
        this.controlService.sendGetriskRequest().subscribe((result: any[]) => {
            //  console.log(result);

            this.Risk = result;
            this.loading = false;
        });
    }
    getAuditunivfourControltype() {
        this.controlService
            .sendGetloadAuditunivfourRequest()
            .subscribe((result: any[]) => {
                //   console.log(result);

                this.Auditunivfour = result;
                this.loading = false;
            });
    }

    filterAuditunivfour(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.Auditunivfour.length; i++) {
            const Auditunivfour = this.Auditunivfour[i];
            if (
                Auditunivfour.au_level_4_uid
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0 ||
                Auditunivfour.au_level_4_desc
                    .toString()
                    .toLowerCase()
                    .includes(query.toLowerCase())
            ) {
                // filtered.push(Auditunivfour);

                //  filtered.push(Auditunivfour.au_level_4_uid + '-' + Auditunivfour.au_level_4_desc + '-' + Auditunivfour.au_level_4_id);
                filtered.push(
                    Auditunivfour.au_level_4_uid +
                        '-' +
                        Auditunivfour.au_level_4_desc
                );
            }
        }
        this.filteredAuditunivfour = filtered;
    }

    getcontrol() {
        //   this.controlService.sendGetcontrolRequest().subscribe((result: any[])=>{
        //  //console.log(result);

        //       this.controls = result;
        //       this.loading = false;

        //     })

        this.controlService
            .sendGetcontrolRequest()
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
                this.controls = res;
            });
    }

    getkeyControltypeControltype() {
        this.controlService
            .sendGetloadKeyControltypeRequest()
            .subscribe((result: any[]) => {
                //  console.log(result);

                this.keyControltype = result;
                this.loading = false;
            });
    }

    filterkeyControltype(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.keyControltype.length; i++) {
            const keyControltype = this.keyControltype[i];
            if (
                keyControltype.code_value_key
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0 ||
                keyControltype.text_code_value
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                // filtered.push(keyControltype);
                //  filtered.push(keyControltype.code_value_key + '-' + keyControltype.text_code_value);
                filtered.push(keyControltype.text_code_value);
            }
        }
        this.filteredkeyControltype = filtered;
    }

    getkeyTypetype() {
        this.controlService
            .sendGetloadKeyTypeRequest()
            .subscribe((result: any[]) => {
                // console.log(result);

                this.keyType = result;
                this.loading = false;
            });
    }

    getkeyFrequencyFrequency() {
        this.controlService
            .sendGetloadKeyFrequencyRequest()
            .subscribe((result: any[]) => {
                //  console.log(result);

                this.keyFrequency = result;
                this.loading = false;
            });
    }

    filterkeyFrequency(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.keyFrequency.length; i++) {
            const keyFrequency = this.keyFrequency[i];
            if (
                keyFrequency.code_value_key
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0 ||
                keyFrequency.text_code_value
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                // filtered.push(keyControltype);
                // filtered.push(keyFrequency.code_value_key + '-' + keyFrequency.text_code_value);
                filtered.push(keyFrequency.text_code_value);
            }
        }
        this.filteredkeyFrequency = filtered;
    }

    filterkeyType(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.keyType.length; i++) {
            const keyType = this.keyType[i];
            if (
                keyType.code_value_key
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0 ||
                keyType.text_code_value
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                // filtered.push(keyControltype);
                // filtered.push(keyType.code_value_key + '-' + keyType.text_code_value);
                filtered.push(keyType.text_code_value);
            }
        }
        this.filteredkeyType = filtered;
    }

    getkeyCategorytype() {
        this.controlService
            .sendGetloadKeyCategoryRequest()
            .subscribe((result: any[]) => {
                // console.log(result);

                this.keyCategory = result;
                this.loading = false;
            });
    }

    filterkeyCategory(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.keyCategory.length; i++) {
            const keyCategory = this.keyCategory[i];
            if (
                keyCategory.text_code_value
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                // filtered.push(keyControltype);
                // filtered.push(keyCategory.code_value_key + '-' + keyCategory.text_code_value);
                filtered.push(keyCategory.text_code_value);
            }
        }
        this.filteredkeyCategory = filtered;
    }

    getBannertype() {
        this.controlService.sendGetRequest().subscribe((result: any[]) => {
            // console.log(result);

            this.Banner = result;
            this.loading = false;
        });
    }

    filterkeycontrol(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.keycontrol.length; i++) {
            const keycontrol = this.keycontrol[i];
            if (
                keycontrol.text_code_value
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                // filtered.push(keyControltype);
                // filtered.push(keycontrol.code_value_key + '-' + keycontrol.text_code_value);
                filtered.push(keycontrol.text_code_value);
            }
        }
        this.filteredkeycontrol = filtered;
    }

    getkeyassertiontype() {
        this.controlService
            .sendGetloadKeyassertionRequest()
            .subscribe((result: any[]) => {
                //   console.log(result);

                this.keyassertion = result;
                this.loading = false;
            });
    }

    filterkeyassertion(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.keyassertion.length; i++) {
            const keyassertion = this.keyassertion[i];
            if (
                keyassertion.text_code_value
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                // filtered.push(keyControltype);
                // filtered.push(keyassertion.code_value_key + '-' + keyassertion.text_code_value);
                filtered.push(keyassertion.text_code_value);
            }
        }
        this.filteredkeyassertion = filtered;
    }

    filterRisk(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.Risk.length; i++) {
            const Risk = this.Risk[i];
            if (
                Risk.risk_uid.toLowerCase().indexOf(query.toLowerCase()) !=
                    -1 ||
                Risk.risk.toLowerCase().indexOf(query.toLowerCase()) != -1 ||
                Risk.business_objective
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) != -1
            ) {
                //filtered.push(Risk);
                filtered.push(
                    Risk.risk_uid +
                        '-' +
                        Risk.risk +
                        '-' +
                        Risk.business_objective
                );
            }
        }
        this.filteredRisk = filtered;
    }

    filterBanner(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.Banner.length; i++) {
            const Banner = this.Banner[i];
            if (
                Banner.banner_uid.toLowerCase().indexOf(query.toLowerCase()) !=
                    -1 ||
                Banner.banner.toLowerCase().indexOf(query.toLowerCase()) != -1
            ) {
                // filtered.push(Banner);
                filtered.push(Banner.banner_uid + '-' + Banner.banner);
            }
        }
        this.filteredBanner = filtered;
    }

    test() {
        //alert("hi");
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    openNew() {
        this.control = {};
        this.selectedItem = [];
        this.selectedcatItem = [];
        this.submitted = false;
        this.controlDialog = true;
    }

    deleteSelectedcontrols() {
        // this.deletecontrolsDialog = true;
        this.confirmationService.confirm({
            header: 'Confirmation!',
            message: 'Are you sure you want to delete selected Control?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.confirmDeleteSelected();
            },
            reject: () => {
                //console.log('rejected');
            },
        });
    }

    editcontrol(control: control) {
        //  debugger;
        //    this.control = {...control};
        this.controlDialog = true;
        const arrayToObject = Object.assign({}, ...this.selectedcontrols);
        this.control = { ...arrayToObject };
        const asstt = this.control.assertion.toString();
        var str_array = asstt.split(',');
        var str_array1 = str_array.map(Number);
        const cattt = this.control.category.toString();
        var sss = cattt.split(',');
        var ss1 = sss.map(Number);
        this.selectedcatItem = ss1;
        this.controlselected = this.control.control_type.toString();
        this.frequencyselected = this.control.frequency.toString();
        this.autoselected = this.control.automation.toString();
        this.selectedItem = str_array1;
        //this.selectedItem = [52, 55, 56, 58, 59];
        this.keyselected = this.control.key_control.toString();
        this.aulfselected = this.control.au_level_4_uid.toString();
        this.bannerselected = this.control.banner_uid.toString();
        this.riskselected = this.control.risk_uid.toString();
    }

    deletecontrol(control: control) {
        this.deletecontrolDialog = true;
        this.control = { ...control };
    }

    confirmDeleteSelected() {
        this.deletecontrolsDialog = false;
        // this.controls = this.controls.filter(val => !this.selectedcontrols.includes(val));
        // this.messageService.add({severity: 'success', summary: 'Successful', detail: 'controls Deleted', life: 3000});
        // this.selectedcontrols = null;

        const arrayToObject = Object.assign({}, ...this.selectedcontrols);
        this.control = { ...arrayToObject };
        // this.banners = this.banners.filter(val => !this.selectedBanners.includes(val));
        //       // this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Banners Deleted', life: 3000});
        //       this.controlService.sendDeletecontrolRequest(this.control.control_uid).subscribe(
        //         res => {
        //         //  console.log(res);
        //           if(res > 0)
        //           {
        //             this.getcontrol();
        //             this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Controls Deleted', life: 3000});
        //             this.control = {};          }
        //         }
        //   );

        // this.controlService
        // .sendDeletecontrolRequest(this.control.control_uid)
        // .pipe(
        //     catchError((err) => {
        //         this.messageService.add({
        //             severity: 'error',
        //             summary: 'ERROR!!',
        //             detail: 'Something Went Wrong !!',
        //             life: 3000,
        //         });
        //      //   console.log(err);
        //         return throwError(err);
        //     }),
        //     finalize(() => {
        //         this.getcontrol();
        //     // this.selectedrisks = null;
        //         this.control = {};
        //         //this.scriptDialog = false;
        //         this.loading = false;
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Control Deleted !!',
        //             life: 3000,
        //         });
        //     })
        // )
        // .subscribe();
        this.controlService
            .sendDeletecontrolRequest(this.control.control_uid)
            .pipe(
                catchError((err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!!',
                        detail: 'Something Went Wrong !!',
                        life: 3000,
                    });
                    //    console.log(err);
                    this.getcontrol();
                    this.control = {};
                    //   this.selectedcontrols = null;
                    return throwError(err);
                })
            )
            .subscribe((res) => {
                if (res.message == 'Success') {
                    this.getcontrol();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success!!',
                        detail: 'Control Deleted !!',
                        life: 3000,
                    });
                    //   this.selectedcontrols = null;
                    this.control = {};
                } else {
                    this.getcontrol();
                    //  this.selectedcontrols = null;
                    this.control = {};
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Warn Message!!',
                        detail: res.message,
                        life: 3000,
                    });
                }
            });

        //  this.selectedcontrols = null;
    }

    confirmDelete() {
        this.deletecontrolDialog = false;
        //  this.controls = this.controls.filter(val => val.id !== this.control.id);
        this.controlService
            .sendDeleteRequest(this.control.control_uid)
            .subscribe((res) => {
                // console.log(res);
                if (res > 0) {
                    this.getcontrol();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'control Deleted',
                        life: 3000,
                    });
                    this.control = {};
                }
            });
    }

    hideDialog() {
        this.controlDialog = false;
        this.submitted = false;
    }

    showPop;
    showPopTitle;
    showContent;

    showInDetail(detail, title) {
        this.showPop = true;
        this.showPopTitle = title;
        this.showContent = detail;
    }

    doOnSelectaudit(event) {
        let x = this.Auditunivfour.filter((ele) => {
            return ele.au_level_4_uid == event.split('-')[0];
        });
        this.aulfselected = x[0].au_level_4_id;
    }

    doOnSelectbanner(event) {
        //  debugger;
        let x = this.Banner.filter((ele) => {
            return ele.banner_uid == event.split('-')[0];
        });
        this.bannerselected = x[0].banner_id;
    }

    doOnSelectrisk(event) {
        //  console.log(event);
        //    debugger;
        // const str = event;
        // const result = str.split('-');
        // //  console.log(result);
        // this.riskselected = result[0].trim().substring(1);

        let x = this.Risk.filter((ele) => {
            return ele.risk_uid == event.split('-')[0];
        });
        this.riskselected = x[0].risk_id;
        return x[0].risk_id;
    }

    doOnSelectcontrol(event) {
        //   console.log(event);
        //   const str =event;
        //   const result = str.split('-');
        //   console.log(result);
        // this.controlselected=result[0].trim();
        let x = this.keyControltype.filter((ele) => {
            return ele.text_code_value == event;
        });
        this.controlselected = x[0].code_value_key;
    }

    doOnSelectfrequency(event) {
        let x = this.keyFrequency.filter((ele) => {
            return ele.text_code_value == event;
        });
        this.frequencyselected = x[0].code_value_key;
    }

    doOnSelectauto(event) {
        let x = this.keyType.filter((ele) => {
            return ele.text_code_value == event;
        });
        this.autoselected = x[0].code_value_key;
    }

    doOnSelectasss(event) {
        let x = this.keyassertion.filter((ele) => {
            return ele.text_code_value == event;
        });
        this.assselected = x[0].code_value_key;
    }

    doOnSelectcategory(event) {
        let x = this.keyCategory.filter((ele) => {
            return ele.text_code_value == event;
        });
        this.categoryselected = x[0].code_value_key;
    }

    doOnSelectkey(event) {
        let x = this.keycontrol.filter((ele) => {
            return ele.text_code_value == event;
        });

        this.keyselected = x[0].code_value_key;
    }

    savecontrol() {
        //debugger;
        this.submitButton.nativeElement.disabled = true;

        this.submitted = true;
        this.datacontrols = {};
        if (this.control.control.trim()) {
            if (this.control.control_uid) {
                // @ts-ignore
                //   this.control.inventoryStatus = this.control.inventoryStatus.value ? this.control.inventoryStatus.value: this.control.inventoryStatus;
                // this.controls[this.findIndexById(this.control.control_uid)] = this.control;
                //  this.control.division = this.control.division;
                //   this.control.control = this.control.control;
                // this.controls.push(this.control);
                //  this.control.control_uid=this.control.control_uid;
                //   this.datacontrols.division = this.control.division;
                //   this.datacontrols.control = this.control.control;

                this.datacontrols.au_level_4_uid = this.aulfselected.toString();
                this.datacontrols.banner_uid = this.bannerselected.toString();
                this.datacontrols.risk_uid = this.riskselected.toString();
                this.datacontrols.control = this.control.control.toString();
                this.datacontrols.comments = this.control.comments.toString();
                this.datacontrols.control_type =
                    this.controlselected.toString();
                this.datacontrols.frequency = this.frequencyselected.toString();
                this.datacontrols.automation = this.autoselected.toString();
                const catte = this.selectedcatItem
                    .concat(this.keyCategory[1].value)
                    .join(',');
                this.datacontrols.category = catte.substring(
                    0,
                    catte.length - 1
                );
                const asste = this.selectedItem
                    .concat(this.keyassertion[1].value)
                    .join(',');
                this.datacontrols.assertion = asste.substring(
                    0,
                    asste.length - 1
                );
                this.datacontrols.key_control = this.keyselected.toString();

                this.datacontrols.control_uid = this.control.control_uid;

                //   this.controlService.sendPutcontrolRequest(this.datacontrols).subscribe(
                //       res => {
                //       //  console.log(res);
                //         if(res > 0)
                //         {
                //           this.getcontrol();
                //           this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Control Updated', life: 3000});
                //         }
                //       }
                // );

                this.controlService
                    .sendPutcontrolRequest(this.datacontrols)
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
                            this.getcontrol();
                            // this.selectedrisks = null;
                            //  this.selectedcontrols = null;
                            //this.scriptDialog = false;
                            this.selectedcontrols = null;
                            this.loading = false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Control Updated !!',
                                life: 3000,
                            });
                        })
                    )
                    .subscribe();
            } else {
                //  this.control.control_uid = this.createId();
                // this.control.code = this.createId();
                // this.control.image = 'control-placeholder.svg';
                // @ts-ignore
                // this.control.division = this.control.division;
                // this.control.control = this.control.control;
                // this.controls.push(this.control);
                this.datacontrols.au_level_4_uid = this.aulfselected.toString();
                this.datacontrols.banner_uid = this.bannerselected.toString();
                this.datacontrols.risk_uid = this.riskselected.toString();
                this.datacontrols.control = this.control.control.toString();
                this.datacontrols.comments = this.control.comments.toString();
                this.datacontrols.control_type =
                    this.controlselected.toString();
                this.datacontrols.frequency = this.frequencyselected.toString();
                this.datacontrols.automation = this.autoselected.toString();
                const catte = this.selectedcatItem
                    .concat(this.keyCategory[1].value)
                    .join(',');
                this.datacontrols.category = catte.substring(
                    0,
                    catte.length - 1
                );
                const asste = this.selectedItem
                    .concat(this.keyassertion[1].value)
                    .join(',');
                this.datacontrols.assertion = asste.substring(
                    0,
                    asste.length - 1
                );
                this.datacontrols.key_control = this.keyselected.toString();

                //   this.controlService.sendPostcontrolRequest(this.datacontrols).subscribe(
                //       res => {
                //      //   console.log(res);
                //         if(res > 0)
                //         {
                //           this.getcontrol();
                //           this.messageService.add({severity: 'success', summary: 'Successful', detail: 'control Created', life: 3000});
                //         }
                //       }
                // );

                this.controlService
                    .sendPostcontrolRequest(this.datacontrols)
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
                            this.getcontrol();
                            //  this.selectedcontrols = null;

                            // this.selectedrisks = null;

                            //this.scriptDialog = false;
                            this.loading = false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'New Control Added !!',
                                life: 3000,
                            });
                        })
                    )
                    .subscribe();
            }

            this.controls = [...this.controls];
            this.controlDialog = false;
            this.control = {};
            this.selectedItem = [];
            this.selectedcatItem = [];
        }
        this.submitButton.nativeElement.disabled = false;
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.controls.length; i++) {
            if (this.controls[i].control_uid === id) {
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

    selectControl(control) {
        this.selectedcontrols = [control];
    }

    selectRisk(ele) {
        this.auditUniverseSerive
            .getControlAudit(this.doOnSelectrisk(ele))
            .subscribe((res) => {
                this.Auditunivfour = res.data;
            });
    }
}
