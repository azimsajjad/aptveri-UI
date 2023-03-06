import { Component, OnInit } from '@angular/core';
import { Organisation, risk } from '../../../api/libraries';
import { BannerService } from '../../../service/librariesservice';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import { catchError, finalize, forkJoin, map, throwError } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuditUniverseService } from 'src/app/service/audituniverseservice';
import { UtilsService } from 'src/app/service/utils.service';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-control-detail',
    templateUrl: './control-detail.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./control-detail.component.scss'],
})
export class ControlDetailComponent implements OnInit {
    loading: boolean = true;
    showTable: boolean = true;

    controls;

    allOrg: Organisation[];
    filteredOrg: Organisation[];
    allRisk: risk[];
    filteredRisk: risk[];
    allAuditUnivFour;
    filteredAuditUnivFour;
    allDepartment;
    filteredDepartment;
    controlType;
    filteredControlType;
    allKeyFrequency;
    filteredKeyFrequency;
    allKeyType;
    filteredKeyType;
    allKeyCategory;
    filteredKeyCategory;
    allKeyAssertion;
    filteredKeyAssertion;
    allKeyControlType;
    filteredKeyControlType;

    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private controlService: BannerService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public accountSvr: AuthService,
        private auditUniverseSerive: AuditUniverseService,
        public utilService: UtilsService
    ) {}

    ngOnInit() {
        this.controlService.getAllOrganizations().subscribe((res) => {
            this.allOrg = res.data;
        });

        this.getcontrol();

        forkJoin([
            this.controlService.sendGetRequest(),
            this.controlService.sendGetriskRequest(),
            this.controlService.sendGetloadAuditunivfourRequest(),
            this.controlService.sendGetloadKeyControlRequest(),
            this.controlService.sendGetloadKeyassertionRequest(),
            this.controlService.sendGetloadKeyCategoryRequest(),
            this.controlService.sendGetloadKeyTypeRequest(),
            this.controlService.sendGetloadKeyFrequencyRequest(),
            this.controlService.sendGetloadKeyControltypeRequest(),
        ]).subscribe((results) => {
            this.allDepartment = results[0].data;
            this.allRisk = results[1].data;
            this.allAuditUnivFour = results[2].data;
            this.controlType = results[3].data;
            this.allKeyAssertion = results[4].data;
            this.allKeyCategory = results[5].data;
            this.allKeyType = results[6].data;
            this.allKeyFrequency = results[7].data;
            this.allKeyControlType = results[8].data;
        });
    }

    getcontrol() {
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

    openNew(ele = null) {
        this.form = this.fb.group({
            control_uid: ele?.control_uid || null,
            organization: [
                this.getOrg(ele?.organization_id) || null,
                Validators.required,
            ],
            riskdesc: [
                this.getRisk(ele?.risk_uid) || null,
                Validators.required,
            ],
            aulfdesc: [
                this.getAudit(ele?.au_level_4_uid) || null,
                Validators.required,
            ],
            bannerdesc: [
                this.getDepartment(ele?.department_uid) || null,
                Validators.required,
            ],
            control: [ele?.control || null, Validators.required],
            comments: [ele?.comments || null, Validators.required],
            controldesc: [
                ele ? this.getKeyControl(ele.control_type) : null,
                Validators.required,
            ],
            frequencydesc: [
                ele ? this.getFrequency(ele.frequency) : null,
                Validators.required,
            ],
            autodesc: [
                ele ? this.getAuto(ele.automation) : null,
                Validators.required,
            ],
            categorydesc: [
                ele ? this.getCategory(ele.category) : null,
                Validators.required,
            ],
            assdesc: [
                ele ? this.getAssertion(ele.assertion) : null,
                Validators.required,
            ],
            keydesc: [
                ele ? this.getKeyControlType(ele.key_control) : null,
                Validators.required,
            ],
        });

        if (ele) {
            this.form
                .get('organization')
                .setValue(this.getOrg(ele?.organization_id));
        }

        this.form
            .get('organization')
            .valueChanges.subscribe((res: Organisation) => {
                forkJoin([
                    this.controlService.loadOptions(
                        res.organization_id,
                        'loadControltype'
                    ),
                    this.controlService.loadOptions(
                        res.organization_id,
                        'loadFrequencytype'
                    ),
                    this.controlService.loadOptions(
                        res.organization_id,
                        'loadCategorytype'
                    ),
                    this.controlService.loadOptions(
                        res.organization_id,
                        'loadAssertiontype'
                    ),
                    this.controlService.loadOptions(
                        res.organization_id,
                        'loadKeyControltype'
                    ),
                    this.controlService.getDepartmentByOrg(res.organization_id),
                    this.controlService.getRiskByOrg(res.organization_id),
                ]).subscribe((result) => {
                    this.allKeyControlType = result[0].data;
                    this.allKeyFrequency = result[1].data;
                    this.allKeyCategory = result[2].data;
                    this.allKeyAssertion = result[3].data;
                    this.controlType = result[4].data;
                    this.allDepartment = [result[5].data];
                    this.allRisk = result[6].data.map((ele) => {
                        ele['risk'] = ele['audit_risk'];
                        return ele;
                    });
                });
            });

        this.showTable = false;
        // console.log(this.);
    }

    saveControl() {
        let apiValue = {
            control_uid: this.form.get('control_uid').value,
            organization_id: this.form
                .get('organization')
                .value.organization_id.toString(),
            risk_uid: this.form.get('riskdesc').value.risk_id.toString(),
            au_level_4_uid: this.form
                .get('aulfdesc')
                .value.au_level_4_id.toString(),
            department_uid: this.form
                .get('bannerdesc')
                .value.department_id.toString(),
            control: this.form.get('control').value,
            comments: this.form.get('comments').value,
            control_type: this.form
                .get('controldesc')
                .value.code_value_key.toString(),
            frequency: this.form
                .get('frequencydesc')
                .value.code_value_key.toString(),
            automation: this.form
                .get('autodesc')
                .value.code_value_key.toString(),
            category: this.extractIds(this.form.get('categorydesc').value),
            assertion: this.extractIds(this.form.get('assdesc').value),
            key_control: this.form
                .get('keydesc')
                .value.code_value_key.toString(),
        };

        console.log(apiValue);
        if (apiValue.control_uid == null) {
            // add
            this.controlService
                .sendPostcontrolRequest(apiValue)
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
                        this.getcontrol();
                        this.loading = false;
                        this.showTable = true;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'New Control Added !!',
                            life: 3000,
                        });
                    })
                )
                .subscribe();
        } else {
            // edit
            this.controlService
                .sendPutcontrolRequest(apiValue)
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
                        this.loading = false;
                        this.showTable = true;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Control Updated !!',
                            life: 3000,
                        });
                    })
                )
                .subscribe();
        }
    }

    deleteSelectedcontrols(ele) {
        this.confirmationService.confirm({
            header: 'Confirmation!',
            message: 'Are you sure you want to delete selected Control?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.controlService
                    .sendDeletecontrolRequest(ele.control_uid)
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
                            this.getcontrol();
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
                        } else {
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Warn Message!!',
                                detail: res.message,
                                life: 3000,
                            });
                        }
                    });
            },
            reject: () => {
                //console.log('rejected');
            },
        });
    }

    // filters

    filterOrg(event) {
        this.filteredOrg = [];
        for (let i = 0; i < this.allOrg.length; i++) {
            let org = this.allOrg[i];
            if (
                org.organization
                    .toLowerCase()
                    .indexOf(event.query.toLowerCase()) == 0
            ) {
                this.filteredOrg.push(org);
            }
        }
    }

    getOrg(id) {
        return this.allOrg.find((x) => x.organization_id === id);
    }

    filterRisk(event) {
        this.filteredRisk = [];
        for (let i = 0; i < this.allRisk.length; i++) {
            let risks = this.allRisk[i];
            if (
                risks.risk.toLowerCase().indexOf(event.query.toLowerCase()) == 0
            ) {
                this.filteredRisk.push(risks);
            }
        }
    }

    getRisk(risk_id: string) {
        return this.allRisk.find((x) => x.risk_id == +risk_id);
    }

    filterAllAuditUnivFour(event) {
        this.filteredAuditUnivFour = [];
        for (let i = 0; i < this.allAuditUnivFour.length; i++) {
            let audits = this.allAuditUnivFour[i];
            if (
                audits.au_level_4_desc
                    .toLowerCase()
                    .indexOf(event.query.toLowerCase()) == 0
            ) {
                this.filteredAuditUnivFour.push(audits);
            }
        }
    }

    getAudit(au_level_4_id) {
        return this.allAuditUnivFour.find(
            (x) => x.au_level_4_id == au_level_4_id
        );
    }

    filterDepartment(event) {
        this.filteredDepartment = [];
        for (let i = 0; i < this.allDepartment.length; i++) {
            let depart = this.allDepartment[i];
            if (
                depart.department
                    .toLowerCase()
                    .indexOf(event.query.toLowerCase()) == 0
            ) {
                this.filteredDepartment.push(depart);
            }
        }
    }

    getDepartment(id) {
        return this.allDepartment.find((x) => x.department_id == id);
    }

    filterControlType(event) {
        this.filteredControlType = [];
        for (let i = 0; i < this.controlType.length; i++) {
            let key = this.controlType[i];
            if (
                key.text_code_value
                    .toLowerCase()
                    .indexOf(event.query.toLowerCase()) == 0
            ) {
                this.filteredControlType.push(key);
            }
        }
    }

    getKeyControl(key_control) {
        return this.controlType.find((x) => x.code_value_key == key_control);
    }

    filterKeyFrequency(event) {
        this.filteredKeyFrequency = [];
        for (let i = 0; i < this.allKeyFrequency.length; i++) {
            let key = this.allKeyFrequency[i];
            if (
                key.text_code_value
                    .toLowerCase()
                    .indexOf(event.query.toLowerCase()) == 0
            ) {
                this.filteredKeyFrequency.push(key);
            }
        }
    }

    getFrequency(frequency) {
        return this.allKeyFrequency.find((x) => x.code_value_key == frequency);
    }

    filterKeyType(event) {
        this.filteredKeyType = [];
        for (let i = 0; i < this.allKeyType.length; i++) {
            let key = this.allKeyType[i];
            if (
                key.text_code_value
                    .toLowerCase()
                    .indexOf(event.query.toLowerCase()) == 0
            ) {
                this.filteredKeyType.push(key);
            }
        }
    }

    getAuto(id) {
        return this.allKeyType.find((x) => x.code_value_key == id);
    }

    filterKeyCategory(event) {
        this.filteredKeyCategory = [];
        for (let i = 0; i < this.allKeyCategory.length; i++) {
            let key = this.allKeyCategory[i];
            if (
                key.text_code_value
                    .toLowerCase()
                    .indexOf(event.query.toLowerCase()) == 0
            ) {
                this.filteredKeyCategory.push(key);
            }
        }
    }

    getCategory(ids) {
        return this.allKeyCategory.filter((x) => {
            return ids?.split(',').includes(x.code_value_key.toString());
        });
    }

    filterKeyAssertion(event) {
        this.filteredKeyAssertion = [];
        for (let i = 0; i < this.allKeyAssertion.length; i++) {
            let key = this.allKeyAssertion[i];
            if (
                key.text_code_value
                    .toLowerCase()
                    .indexOf(event.query.toLowerCase()) == 0
            ) {
                this.filteredKeyAssertion.push(key);
            }
        }
    }

    getAssertion(ids) {
        return this.allKeyAssertion.filter((x) => {
            return ids?.split(',').includes(x.code_value_key.toString());
        });
    }

    filterKeyControlType(event) {
        this.filteredKeyControlType = [];
        for (let i = 0; i < this.allKeyControlType.length; i++) {
            let key = this.allKeyControlType[i];
            if (
                key.text_code_value
                    .toLowerCase()
                    .indexOf(event.query.toLowerCase()) == 0
            ) {
                this.filteredKeyControlType.push(key);
            }
        }
    }

    getKeyControlType(id) {
        return this.allKeyControlType.find((x) => x.code_value_key == id);
    }

    extractIds(arr) {
        let ids = arr.map((object) => {
            return object.code_value_key;
        });
        return ids.join(',');
    }

    clear(table: Table) {
        table.clear();
    }
}
