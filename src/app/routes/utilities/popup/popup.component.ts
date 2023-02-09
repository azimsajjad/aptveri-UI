import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {
    constructor(public config: DynamicDialogConfig) {}

    ngOnInit(): void {
        console.log(this.config);
    }
}
