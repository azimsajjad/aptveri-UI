import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, finalize } from 'rxjs';
import { Organisation } from 'src/app/api/libraries';
import { BannerService } from 'src/app/service/librariesservice';

@Component({
    selector: 'app-organisation',
    templateUrl: './organisation.component.html',
    styleUrls: ['./organisation.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class OrganisationComponent implements OnInit {
    constructor(
        private libraryService: BannerService,
        private confirmService: ConfirmationService,
        private messageService: MessageService,
        private fb: FormBuilder
    ) {}

    allOrg: Organisation[];
    orgDialog: boolean = false;
    orgForm: FormGroup;

    ngOnInit(): void {
        this.getAllOrg();
    }

    getAllOrg() {
        this.libraryService.getAllOrganizations().subscribe((res) => {
            this.allOrg = res.data;
        });
    }

    openOrg(ele: Organisation = null) {
        this.orgForm = this.fb.group({
            organization_uid: ele?.organization_uid || null,
            organization: [ele?.organization || null, Validators.required],
            organization_description: [
                ele?.organization_description || null,
                Validators.required,
            ],
        });
        this.orgDialog = true;
    }

    orgFormSubmit() {
        if (this.orgForm.get('organization_uid').value) {
            // edit
            this.libraryService
                .editOrganisation(this.orgForm.value)
                .pipe(
                    catchError((err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error!!',
                            detail: 'something went wrong!',
                            life: 3000,
                        });
                        throw new Error(err);
                    }),
                    finalize(() => {
                        this.orgDialog = false;
                        this.getAllOrg();
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success!!',
                            detail: 'Organisation has been edited',
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
        } else {
            // add
            this.libraryService
                .addOrganisation(this.orgForm.value)
                .pipe(
                    catchError((err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error!!',
                            detail: 'something went wrong!',
                            life: 3000,
                        });
                        throw new Error(err);
                    }),
                    finalize(() => {
                        this.orgDialog = false;
                        this.getAllOrg();
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success!!',
                            detail: 'New Organisation has been added',
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
    }

    deleteOrg(ele: Organisation) {
        this.confirmService.confirm({
            header: 'Confirmation!',
            message: 'Are you sure to delete this Organisation?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.libraryService
                    .deleteOrganization(ele.organization_uid)
                    .pipe(
                        catchError((err) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error!!',
                                detail: 'something went wrong!',
                                life: 3000,
                            });
                            throw new Error(err);
                        }),
                        finalize(() => {
                            this.getAllOrg();
                        })
                    )
                    .subscribe((res) => {
                        if (res.data) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success!!',
                                detail:
                                    'Organisation: ' +
                                    ele.organization +
                                    ' has been deleted',
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
            },
            reject: () => {
                console.log('rejected');
            },
        });
        console.log(ele);
    }

    clear(table: Table) {
        table.clear();
    }
}
