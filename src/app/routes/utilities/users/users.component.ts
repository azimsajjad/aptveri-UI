import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, finalize } from 'rxjs';
import { Role, User } from 'src/app/api/users';
import { UserService } from 'src/app/service/user.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    providers: [UserService, MessageService, ConfirmationService],
})
export class UsersComponent implements OnInit {
    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        private messageService: MessageService
    ) {}

    users: User;
    allRole: Role[];
    userForm: FormGroup;
    userDialog: boolean;

    ngOnInit(): void {
        this.getAllUsers();
        this.getAllRoles();
    }

    getAllUsers() {
        this.userService.getAllUsers().subscribe((res) => {
            this.users = res.data.map((ele: User) => {
                ele.acct_status == 1
                    ? (ele.acct_status = true)
                    : (ele.acct_status = false);
                return ele;
            });
        });
    }

    clear(table: Table) {
        table.clear();
    }

    getAllRoles() {
        this.userService.getAllRole().subscribe((res) => {
            this.allRole = res.data;
        });
    }

    openUser(ele: User = null) {
        this.userForm = this.fb.group({
            userId: ele?.userId || null,
            email: [
                ele?.email || null,
                [Validators.required, Validators.email],
            ],
            fullName: [ele?.fullName || null, Validators.required],
            roleName: [
                this.getRole(ele?.roleName) || null,
                Validators.required,
            ],
            password: [null, ele ? null : Validators.required],
        });

        this.userDialog = true;
    }

    userFormSubmit() {
        if (this.userForm.get('userId').value) {
            this.userService
                .editUser(this.userForm.value)
                .pipe(
                    catchError((err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'ERROR!',
                            detail: 'something went wrong!',
                            life: 3000,
                        });
                        throw new Error(err);
                    }),
                    finalize(() => {
                        this.userDialog = false;
                        this.getAllUsers();
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success!!',
                            detail: 'User Updated!',
                            life: 3000,
                        });
                    } else {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'INFO!',
                            detail: res.message,
                            life: 3000,
                        });
                    }
                });
        } else {
            this.userService
                .addUser(this.userForm.value)
                .pipe(
                    catchError((err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'ERROR!',
                            detail: 'something went wrong!',
                            life: 3000,
                        });
                        throw new Error(err);
                    }),
                    finalize(() => {
                        this.userDialog = false;
                        this.getAllUsers();
                    })
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success!!',
                            detail: 'User Created',
                            life: 3000,
                        });
                    } else {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'INFO!',
                            detail: res.message,
                            life: 3000,
                        });
                    }
                });
        }
    }

    updateUser(ele: User, event) {
        this.userService
            .disableUser(ele.userId, event.checked)
            .pipe(
                catchError((err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!',
                        detail: 'something went wrong!',
                        life: 3000,
                    });
                    throw new Error(err);
                }),
                finalize(() => {
                    this.getAllUsers();
                })
            )
            .subscribe((res) => {
                if (res.data) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success!!',
                        detail: 'User: ' + ele.fullName + ' has been deleted',
                        life: 3000,
                    });
                } else {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'INFO!',
                        detail: res.message,
                        life: 3000,
                    });
                }
            });
    }

    getRole(val: string) {
        return this.allRole.find((ele) => ele.role === val);
    }
}
