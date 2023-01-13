import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
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
        private confirmService: ConfirmationService,
        private messageService: MessageService
    ) {}

    users: User;
    allRole: Role;
    userForm: FormGroup;
    userDialog: boolean;

    ngOnInit(): void {
        this.getAllUsers();
        this.getAllRoles();
    }

    getAllUsers() {
        this.userService.getAllUsers().subscribe((res) => {
            this.users = res.data;
        });
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
            roleName: [ele?.roleName || 'Admin', Validators.required],
            password: [null, ele ? null : Validators.required],
        });
        this.userDialog = true;
    }

    userFormSubmit() {
        if (this.userForm.get('userId').value) {
            console.log('edit');
        } else {
            console.log('add');
        }
    }

    deleteUser(ele: User) {
        this.confirmService.confirm({
            header: 'Confirmation!',
            message: 'Are you sure to delete this User?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success!!',
                    detail: 'User: ' + ele.fullName + ' has been deleted',
                    life: 3000,
                });
            },
            reject: () => {
                console.log('rejected');
            },
        });
    }
}
