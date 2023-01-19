import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-master',
    templateUrl: './master.component.html',
    styleUrls: ['./master.component.scss'],
})
export class MasterComponent implements OnInit {
    constructor(private fb: FormBuilder) {}

    selectedPage;
    selectedOption;

    addDialog: boolean = false;
    addForm: FormGroup;

    ngOnInit(): void {}

    openDialog() {
        this.addForm = this.fb.group({
            page: this.selectedPage.code,
            option: this.selectedOption.code,
            name: [null, Validators.required],
            code: [null, Validators.required],
        });

        this.addDialog = true;
    }

    addFormSubmit() {
        console.log(this.addForm.value);
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
