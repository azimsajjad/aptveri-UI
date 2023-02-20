import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { catchError, finalize, forkJoin } from 'rxjs';
import { Organisation } from 'src/app/api/libraries';
import { CodeValue, PageOption } from 'src/app/api/utils';
import { BannerService } from 'src/app/service/librariesservice';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
    selector: 'app-master',
    templateUrl: './master.component.html',
    styleUrls: ['./master.component.scss'],
    providers: [MessageService],
})
export class MasterComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private libraryService: BannerService,
        private utilService: UtilsService,
        private messageService: MessageService
    ) {}

    selectedOrg = new FormControl(null);
    selectedPage = new FormControl(null);
    selectedOption = new FormControl(null);
    allOrg: Organisation[];
    pageOption: PageOption[];
    optionsOptions: PageOption[];
    codeValues: CodeValue[];
    filteredCodeValues: CodeValue[];

    addDialog: boolean = false;
    loading: boolean = true;
    addForm: FormGroup;

    ngOnInit(): void {
        forkJoin([
            this.libraryService.getAllOrganizations(),
            this.utilService.getPageOption(),
        ]).subscribe((results) => {
            this.allOrg = results[0].data;
            this.pageOption = this.filterUnique(results[1].data, 'page_name');
            this.getCodeValues();
        });

        this.selectedOrg.valueChanges.subscribe((res: Organisation) => {
            this.filteredCodeValues = this.codeValues.filter(
                (ele: CodeValue) => {
                    return ele.organization_id == res.organization_id;
                }
            );
        });

        this.selectedPage.valueChanges.subscribe((res: PageOption) => {
            this.utilService.getPageOption(res.page_id).subscribe((resp) => {
                this.optionsOptions = resp.data;
            });
        });
    }

    getCodeValues() {
        this.loading = true;
        this.utilService.getAllCodeValue().subscribe((res) => {
            this.codeValues = res.data;
            this.filteredCodeValues = this.codeValues;
            this.loading = false;
        });
    }

    openDialog() {
        this.addForm = this.fb.group({
            organization_id: this.selectedOrg.value.organization_id,
            option_id: this.selectedOption.value.option_id,
            option: this.selectedPage.value.option_name,
            name: [null, Validators.required],
            code: [null, Validators.required],
        });
        this.addDialog = true;
    }

    addFormSubmit() {
        this.utilService
            .addLibraryDropdown(this.addForm.value)
            .pipe(
                catchError((err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'ERROR!!',
                        detail: 'Something Went Wrong !!',
                        life: 3000,
                    });
                    throw new Error(err);
                }),
                finalize(() => {
                    this.addForm.reset();
                    this.selectedOrg = null;
                    this.selectedOption.reset();
                    this.selectedPage.reset();
                    this.addDialog = false;
                    this.getCodeValues();
                })
            )
            .subscribe((res) => {
                if (res.data) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success!!',
                        detail: 'Options succesfully added',
                        life: 3000,
                    });
                } else {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'INFO!!',
                        detail: res.message,
                        life: 3000,
                    });
                }
            });
    }

    filterUnique(arr, element) {
        let unique = {};
        return arr.filter((obj) => {
            if (!unique[obj[element]]) {
                unique[obj[element]] = true;
                return true;
            }
            return false;
        });
    }

    masterCategory: DropdownItem[] = [
        {
            name: 'Risk',
            code: 'risk',
            items: [
                { name: 'Category', code: 'category' },
                { name: 'Type', code: 'type' },
                { name: 'Exposure', code: 'exposure' },
                { name: 'Impact', code: 'impact' },
                { name: 'Liklihood', code: 'liklihood' },
            ],
        },
        {
            name: 'Control',
            code: 'control',
            items: [
                { name: 'Type', code: 'type' },
                { name: 'Frequency', code: 'frequency' },
                { name: 'Automation', code: 'automation' },
                { name: 'Category', code: 'category' },
                { name: 'Assertion', code: 'assertion' },
                { name: 'Key', code: 'key' },
            ],
        },
        {
            name: 'Audit Program',
            code: 'audit_program',
            items: [{ name: 'Frequency', code: 'frequency' }],
        },
    ];
}

interface DropdownItem {
    name: string;
    code: string;
    items?: DropdownItem[];
}
