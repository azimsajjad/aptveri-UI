import {
    Component,
    OnInit,
    ViewChild,
    ChangeDetectorRef,
    ElementRef,
} from '@angular/core';
import { Banner } from '../../../api/libraries';
import { BannerService } from '../../../service/librariesservice';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from '../../../service/auth.service';
import {
    FormControl,
    FormGroup,
    Validators,
    FormBuilder,
    ValidatorFn,
    AbstractControl,
} from '@angular/forms';

import {
    catchError,
    debounceTime,
    finalize,
    forkJoin,
    map,
    throwError,
} from 'rxjs';
@Component({
    selector: 'app-banners-detail',
    templateUrl: './banners-detail.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['../../../../assets/demo/badges.scss'],
})
export class BannersDetailComponent implements OnInit {
    bannerDialog: boolean;
    form: FormGroup;
    deleteBannerDialog: boolean = false;

    deleteBannersDialog: boolean = false;

    banners: Banner[];

    databanners: Banner;

    banner: Banner;
    loading: boolean = true;

    selectedBanners: Banner[];

    submitted: boolean;

    cols: any[];
    @ViewChild('dt1') table: Table;

    @ViewChild('filter') filter: ElementRef;

    statuses: any[];

    rowsPerPageOptions = [5, 10, 20];

    @ViewChild('submitButton') submitButton: ElementRef;

    constructor(
        private fb: FormBuilder,
        private bannerService: BannerService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public accountSvr: AuthService
    ) {}

    ngOnInit() {
        // this.banner = {};
        this.getbanner();
        this.cols = [
            { field: 'banner_uid', header: 'Banner ID' },
            { field: 'division', header: 'Division' },
            { field: 'banner', header: 'Banner' },
        ];

        this.form = this.fb.group({
            division: [
                '',
                Validators.compose([
                    Validators.required,

                    Validators.minLength(1),
                ]),
            ],
            banner: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                ]),
            ],
        });
    }

    getbanner() {
        // this.bannerService.sendGetRequest().subscribe((result: any[])=>{
        //   //  console.log(result);

        //     this.banners = result;
        //     this.loading = false;

        //   })
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
                this.banners = res;
            });
    }

    test() {
        // alert("hi");
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    openNew() {
        this.banner = {};
        this.submitted = false;
        this.bannerDialog = true;
    }

    deleteSelectedBanners() {
        // this.deleteBannersDialog = true;
        this.confirmationService.confirm({
            header: 'Confirmation!',
            message: 'Are you sure you want to delete selected Banner?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.confirmDeleteSelected();
            },
            reject: () => {
                // console.log('rejected');
            },
        });
    }

    editBanner() {
        //  debugger;
        //this.banners = this.banners.filter(val => this.selectedBanners.includes(val));
        // this.banner = {...this.selectedBanners};
        // this.banner = {...this.selectedBanners};
        this.bannerDialog = true;
        //   var colorsObj=this.arrayToObject(this.selectedBanners);

        const arrayToObject = Object.assign({}, ...this.selectedBanners);
        this.banner = { ...arrayToObject };
    }

    //   editBanner(banner: Banner) {
    //     debugger;
    //     this.banner = {...banner};
    //     this.bannerDialog = true;
    // }

    arrayToObject(arr) {
        var obj = {};
        for (var i = 0; i < arr.length; ++i) {
            obj[i] = arr[i];
        }
        return obj;
    }

    deleteBanner(banner: Banner) {
        this.deleteBannerDialog = true;
        this.banner = { ...banner };
    }

    confirmDeleteSelected() {
        // debugger;
        this.deleteBannersDialog = false;
        const arrayToObject = Object.assign({}, ...this.selectedBanners);
        this.banner = { ...arrayToObject };
        // debugger;
        // this.banners = this.banners.filter(val => !this.selectedBanners.includes(val));
        // this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Banners Deleted', life: 3000});
        //     this.bannerService.sendDeleteRequest(this.banner.banner_uid).subscribe(
        //       res => {
        //      //   console.log(res);
        //         if(res > 0)
        //         {
        //           this.getbanner();
        //           this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Banner Deleted', life: 3000});
        //           this.banner = {};          }
        //       }
        // );

        // this.confirmationService.confirm({
        //     header: 'Confirmation!',
        //     message: 'Do you want to delete this Banner?',
        //     icon: 'pi pi-exclamation-triangle',
        //     accept: () => {
        this.bannerService
            .sendDeleteRequest(this.banner.banner_uid)
            .pipe(
                catchError((err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!!',
                        detail: 'Something Went Wrong !!',
                        life: 3000,
                    });
                    //  this.selectedBanners = null;
                    this.banner = {};
                    //    console.log(err);
                    return throwError(err);
                })
            )
            .subscribe((res) => {
                //  alert(res.message);
                if (res.message == 'Success') {
                    this.getbanner();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success!!',
                        detail: 'Banner Deleted !!',
                        life: 3000,
                    });
                    //  this.selectedBanners = null;
                    this.banner = {};
                } else {
                    this.getbanner();
                    //   this.selectedBanners = null;
                    this.banner = {};
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Warn Message!!',
                        detail: res.message,
                        life: 3000,
                    });
                }
            });
        // // },
        // // reject: () => {
        // //     console.log(false);
        // // },
        //});

        // this.bannerService
        //             .sendDeleteRequest(this.banner.banner_uid)
        //             .pipe(
        //                 catchError((err) => {
        //                     this.messageService.add({
        //                         severity: 'error',
        //                         summary: 'ERROR!!',
        //                         detail: 'Something Went Wrong !!',
        //                         life: 3000,
        //                     });
        //                  //   console.log(err);
        //                     return throwError(err);
        //                 }),
        //                 finalize(() => {
        //                     this.getbanner();
        // 					this.selectedBanners = null;
        //                     this.banner = {};
        //                     //this.scriptDialog = false;
        //                     this.loading = false;
        //                     this.messageService.add({
        //                         severity: 'success',
        //                         summary: 'Successful',
        //                         detail: 'Banner Deleted !!',
        //                         life: 3000,
        //                     });
        //                 })
        //             )
        //             .subscribe();

        //   this.selectedBanners = null;
    }

    confirmDelete() {
        this.deleteBannerDialog = false;
        //  this.banners = this.banners.filter(val => val.id !== this.banner.id);
        this.bannerService
            .sendDeleteRequest(this.banner.banner_uid)
            .subscribe((res) => {
                //    console.log(res);
                if (res > 0) {
                    this.getbanner();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Banner Deleted',
                        life: 3000,
                    });
                    this.banner = {};
                }
            });
    }

    hideDialog() {
        this.bannerDialog = false;
        this.submitted = false;
    }

    saveBanner() {
        this.submitButton.nativeElement.disabled = true;
        this.submitted = true;
        //debugger;
        this.databanners = {};
        if (this.banner.division.trim()) {
            if (this.banner.banner_uid) {
                // @ts-ignore
                //   this.banner.inventoryStatus = this.banner.inventoryStatus.value ? this.banner.inventoryStatus.value: this.banner.inventoryStatus;
                // this.banners[this.findIndexById(this.banner.banner_uid)] = this.banner;
                this.banner.division = this.banner.division;
                this.banner.banner = this.banner.banner;
                // this.banners.push(this.banner);
                this.banner.banner_uid = this.banner.banner_uid;
                this.databanners.division = this.banner.division;
                this.databanners.banner = this.banner.banner;

                this.databanners.banner_uid = this.banner.banner_uid;
                //     this.bannerService.sendPutRequest(this.databanners).subscribe(
                //         res => {
                //      //     console.log(res);
                //           if(res > 0)
                //           {
                //             this.getbanner();
                //             this.selectedBanners = null;
                //             this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Banner Updated', life: 3000});
                //           }
                //         }
                //   );
                //comment on aug 1
                // this.bannerService
                //     .sendPutRequest(this.databanners)
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
                //             this.getbanner();
                //             //   this.selectedBanners = null;

                //             //this.scriptDialog = false;
                //             this.loading = false;
                //             this.messageService.add({
                //                 severity: 'success',
                //                 summary: 'Successful',
                //                 detail: 'Banner Updated !!',
                //                 life: 3000,
                //             });
                //         })
                //     )
                //     .subscribe();

                this.bannerService
                    .sendPutRequest(this.databanners)
                    .pipe(
                        catchError((err) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'ERROR!!',
                                detail: 'Something Went Wrong !!',
                                life: 3000,
                            });
                            //  this.selectedBanners = null;
                            this.banner = {};
                            //    console.log(err);
                            return throwError(err);
                        }),
                        finalize(() => {
                            this.selectedBanners = null;
                        })
                    )
                    .subscribe((res) => {
                        //  alert(res.message);
                        if (res.message == 'Success') {
                            this.getbanner();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success!!',
                                detail: 'Banner Updated !!',
                                life: 3000,
                            });
                            //  this.selectedBanners = null;
                            this.banner = {};
                        } else {
                            this.getbanner();
                            //   this.selectedBanners = null;
                            this.banner = {};
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Warn Message!!',
                                detail: res.message,
                                life: 3000,
                            });
                        }
                    });
            } else {
                //  this.banner.banner_uid = this.createId();
                // this.banner.code = this.createId();
                // this.banner.image = 'banner-placeholder.svg';
                // @ts-ignore
                //edit
                this.banner.division = this.banner.division;
                this.banner.banner = this.banner.banner;
                // this.banners.push(this.banner);
                this.databanners.division = this.banner.division;
                this.databanners.banner = this.banner.banner;

                //     this.bannerService.sendPostRequest(this.databanners).subscribe(
                //         res => {
                //       //    console.log(res);
                //           if(res > 0)
                //           {
                //             this.getbanner();
                //             this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Banner Created', life: 3000});
                //           }
                //         }
                //   );

                //comment on 1 aug
                //     this.bannerService
                //         .sendPostRequest(this.databanners)
                //         .pipe(
                //             catchError((err) => {
                //                 this.messageService.add({
                //                     severity: 'error',
                //                     summary: 'ERROR!!',
                //                     detail: 'Something Went Wrong !!',
                //                     life: 3000,
                //                 });
                //                 //   console.log(err);
                //                 return throwError(err);
                //             }),
                //             finalize(() => {
                //                 this.getbanner();

                //                 //this.scriptDialog = false;
                //                 this.loading = false;
                //                 this.messageService.add({
                //                     severity: 'success',
                //                     summary: 'Successful',
                //                     detail: 'New Banner Created !!',
                //                     life: 3000,
                //                 });
                //             })
                //         )
                //         .subscribe();
                this.bannerService
                    .sendPostRequest(this.databanners)
                    .pipe(
                        catchError((err) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'ERROR!!',
                                detail: 'Something Went Wrong !!',
                                life: 3000,
                            });
                            //  this.selectedBanners = null;
                            this.banner = {};
                            //    console.log(err);
                            return throwError(err);
                        })
                    )
                    .subscribe((res) => {
                        //  alert(res.message);
                        if (res.message == 'Success') {
                            this.getbanner();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success!!',
                                detail: 'New Banner Created !!',
                                life: 3000,
                            });
                            //  this.selectedBanners = null;
                            this.banner = {};
                        } else {
                            this.getbanner();
                            //   this.selectedBanners = null;
                            this.banner = {};
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Warn Message!!',
                                detail: res.message,
                                life: 3000,
                            });
                        }
                    });
            }
            this.banners = [...this.banners];
            this.bannerDialog = false;
            this.banner = {};
        }
        this.submitButton.nativeElement.disabled = false;
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.banners.length; i++) {
            if (this.banners[i].banner_uid === id) {
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

    selectBanner(banner) {
        this.selectedBanners = [banner];
    }
}
