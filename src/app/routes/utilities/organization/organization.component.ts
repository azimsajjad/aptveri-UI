import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize } from 'rxjs';
import { Organization } from 'src/app/api/utilities.model';
import { UtilityService } from 'src/app/service/utility.service';

@Component({
    selector: 'app-organization',
    templateUrl: 'organization.component.html',
    styleUrls: ['organization.component.scss'],
})
export class OrganizationComponent implements OnInit {
    allOrg: Organization[];
    orgDialog = false;
    orgForm: FormGroup;

    constructor(
        private utilityService: UtilityService,
        private fb: FormBuilder,
        private confirmService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.getAllOrganization();
    }

    getAllOrganization(): void {
        this.utilityService.getAllOrganizations().subscribe((res) => {
            this.allOrg = res.data;
        });
    }

    openOrganization(ele: Organization = null): void {
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

    orgFormSubmit(): void {
        const organizationUid = this.orgForm.get('organization_uid').value;

        const request$ = organizationUid
            ? this.utilityService.editOrganization(this.orgForm.value)
            : this.utilityService.addOrganization(this.orgForm.value);

        request$
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
                    this.orgDialog = false;
                    this.getAllOrganization();
                })
            )
            .subscribe((res) => {
                if (res.data) {
                    const successMessage = organizationUid
                        ? 'Organization has been edited'
                        : 'New Organization has been added';

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success!!',
                        detail: successMessage,
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

    deleteOrganization(ele: Organization): void {
        this.confirmService.confirm({
            header: 'Confirmation!',
            message: 'Are you sure you want to delete this Organization?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.utilityService
                    .deleteOrganization(ele.organization_uid)
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
                            this.getAllOrganization();
                        })
                    )
                    .subscribe((res) => {
                        if (res.data) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success!!',
                                detail: `Organization: ${ele.organization} has been deleted`,
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
                console.log('Rejected');
            },
        });
    }
}
