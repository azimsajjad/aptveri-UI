import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, throwError } from 'rxjs';
import { License, Organization } from 'src/app/api/utilities.model';
import { UtilityService } from 'src/app/service/utility.service';

@Component({
    selector: 'app-license',
    templateUrl: 'license.component.html',
    styleUrls: ['license.component.scss'],
})
export class LicenseComponent implements OnInit {
    allLicense: License[];
    allOrg: Organization[];
    filteredOrg: Organization[];

    licenseDialog: boolean = false;
    emailDialog: boolean = false;
    loading: boolean = true;

    licenseForm: FormGroup;
    emailForm: FormGroup;

    constructor(
        private utilityService: UtilityService,
        private fb: FormBuilder,
        private confirmService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.utilityService.getAllOrganizations().subscribe((res) => {
            this.allOrg = res.data;
        });

        this.getAllLicense();
    }

    getAllLicense(number = 0) {
        this.utilityService.getAllLicense(number).subscribe((res) => {
            this.allLicense = res.data;

            this.loading = false;
        });
    }

    openNew(license: License) {
        this.licenseForm = this.fb.group({
            licenseid: license ? license.licenceid : null,
            licensor: 'Aptus Data Labs Technologies Pvt Ltd',
            licensee: license
                ? this.getOrganization(license.licensee_id)
                : null,
            licensetype: license ? license.licensetype : null,
            issuedate: license ? new Date(license.issuedate) : null,
            expiration: license ? new Date(license.expiration) : null,
            servername: license ? license.servername : null,
            datasource: license ? license.datasource : null,
            organisation: license ? license.organisation : null,
            department: license ? license.department : null,
            script: license ? license.script : null,
            connection: license ? license.connection : null,
            audit: license ? license.audit : null,
            ondemand_exc: license ? license.ondemand_exc : null,
            schedule_exc: license ? license.schedule_exc : null,
        });

        this.licenseDialog = true;
    }

    licenseFormSubmit() {
        this.licenseForm.addControl(
            'licensee_id',
            new FormControl(
                this.licenseForm.get('licensee').value.organization_id
            )
        );

        this.licenseForm
            .get('licensee')
            .setValue(this.licenseForm.get('licensee').value.organization);

        if (this.licenseForm.get('licenseid').value == null) {
            this.utilityService
                .addLicense(this.licenseForm.value)
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
                        this.getAllLicense();
                        this.licenseDialog = false;
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success!!',
                            detail: 'License Added !!',
                            life: 3000,
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'ERROR!!',
                            detail: 'Something Went Wrong !!',
                            life: 3000,
                        });
                    }
                });
        } else {
            this.utilityService
                .editLicense(this.licenseForm.value)
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
                        this.getAllLicense();
                        this.licenseDialog = false;
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'INFO!!',
                            detail: 'License Edited !!',
                            life: 3000,
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'ERROR!!',
                            detail: 'Something Went Wrong !!',
                            life: 3000,
                        });
                    }
                });
        }
    }

    changeStatus(license: License, event) {
        this.utilityService
            .deleteLicense(license.licenceid, event.checked)
            .pipe(
                catchError((err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error!!',
                        detail: 'Something went wrong!',
                        life: 3000,
                    });
                    throw new Error(err);
                })
            )
            .subscribe((res: any) => {
                if (res.data) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success!!',
                        detail: `License has been deleted`,
                        life: 3000,
                    });
                } else {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Info!!',
                        detail: res.message,
                        life: 3000,
                    });
                }
            });
    }

    downloadLicense(license: License) {
        this.utilityService
            .downloadLicense(license.licenceid)
            .pipe(
                catchError((err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error!!',
                        detail: 'Something went wrong!',
                        life: 3000,
                    });
                    throw new Error(err);
                })
            )
            .subscribe((res: any) => {
                if (res.data) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success!!',
                        detail: `License Downloaded!!`,
                        life: 3000,
                    });
                } else {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Info!!',
                        detail: res.message,
                        life: 3000,
                    });
                }
            });
    }

    emailLicense(license: License) {
        this.emailForm = this.fb.group({
            licenceid: license.licenceid,
            to: [null, Validators.required],
            cc: null,
            message: null,
        });

        this.emailDialog = true;
    }

    emailFormSubmit() {
        console.log(this.emailForm.value);
        this.utilityService
            .emailLicense(this.emailForm.value)
            .pipe(
                catchError((err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error!!',
                        detail: 'Something went wrong!',
                        life: 3000,
                    });
                    throw new Error(err);
                }),
                finalize(() => {
                    this.emailDialog = false;
                })
            )
            .subscribe((res: any) => {
                if (res.data) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success!!',
                        detail: `Email Send!!`,
                        life: 3000,
                    });
                } else {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Info!!',
                        detail: res.message,
                        life: 3000,
                    });
                }
            });
    }

    // filters

    getOrganization(organization_id: number) {
        const organization = this.allOrg.find(
            (x) => x.organization_id === organization_id
        );

        if (!organization) {
            return null;
        }

        return organization;
    }

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

    licenseType = [
        { name: 'Full Version', code: 'full' },
        { name: 'Trail Version', code: 'trail' },
    ];
}
