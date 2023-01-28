import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, map, throwError } from 'rxjs';
import { Banner, Organisation } from 'src/app/api/libraries';
import { AuthService } from 'src/app/service/auth.service';
import { BannerService } from 'src/app/service/librariesservice';

@Component({
    selector: 'app-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class BannerComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private bannerService: BannerService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public accountSvr: AuthService
    ) {}

    banner;
    selectedBanner;
    allOrg: Organisation[];

    loadingTable: boolean = true;
    bannerDialog: boolean = false;

    bannerForm: FormGroup;

    ngOnInit() {
        this.getBanner();

        this.bannerService.getAllOrganizations().subscribe((res) => {
            this.allOrg = res.data;
        });
    }

    getBanner() {
        this.bannerService
            .sendGetRequest()
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
                    this.loadingTable = false;
                })
            )
            .subscribe((res) => {
                res.map((res) => {
                    res.record_status == 0
                        ? (res.record_status = false)
                        : (res.record_status = true);
                    return res;
                });
                this.banner = res;
            });
    }

    openBanner(ele: Banner = null) {
        this.bannerForm = this.fb.group({
            department_uid: ele ? ele.department_uid : null,
            organization: [
                ele
                    ? this.getOrgnaisation(ele.organization)
                    : this.allOrg[0].organization,
                [Validators.required, Validators.minLength(1)],
            ],
            department: [
                ele ? ele.department : null,
                [Validators.required, Validators.minLength(1)],
            ],
        });

        this.bannerDialog = true;
    }

    bannerFormSubmit() {
        let apiObj = {
            department: this.bannerForm.value.department,
            department_uid: this.bannerForm.value.department_uid,
            organization:
                this.bannerForm.get('organization').value.organization,
            organization_id:
                this.bannerForm.get('organization').value.organization_id,
        };

        if (this.bannerForm.get('department_uid').value == null) {
            this.bannerService
                .sendPostRequest(apiObj)
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
                        this.bannerDialog = false;
                    })
                )
                .subscribe((res) => {
                    if (res.message == 'Success') {
                        this.getBanner();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success!!',
                            detail: 'New Banner Created !!',
                            life: 3000,
                        });
                    } else {
                        this.getBanner();
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Warn Message!!',
                            detail: res.message,
                            life: 3000,
                        });
                    }
                });
        } else {
            this.bannerService
                .sendPutRequest(apiObj)
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
                        this.bannerDialog = false;
                    })
                )
                .subscribe((res) => {
                    if (res.message == 'Success') {
                        this.getBanner();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success!!',
                            detail: 'Banner Updated !!',
                            life: 3000,
                        });
                    } else {
                        this.getBanner();
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Warn Message!!',
                            detail: res.message,
                            life: 3000,
                        });
                    }
                });
        }
    }

    getOrgnaisation(organization: string) {
        return this.allOrg.find((x) => x.organization == organization);
    }

    deleteBanner(ele: Banner) {
        this.confirmationService.confirm({
            header: 'Confirmation!',
            message: 'Are you sure you want to delete selected Banner?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.bannerService
                    .sendDeleteRequest(ele.department_uid)
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
                        if (res.message == 'Success') {
                            this.getBanner();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success!!',
                                detail: 'Banner Deleted !!',
                                life: 3000,
                            });
                            this.banner = {};
                        } else {
                            this.banner();
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
                // console.log('rejected');
            },
        });
    }
}
