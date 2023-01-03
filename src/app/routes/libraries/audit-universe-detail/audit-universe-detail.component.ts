import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
    DataAULevel1,
    DataAULevel2,
    DataAULevel3,
    DataAULevel4,
} from 'src/app/api/auditUniverse';

@Component({
    selector: 'app-audit-universe-detail',
    providers: [MessageService, ConfirmationService],
    templateUrl: './audit-universe-detail.component.html',
    styleUrls: ['./audit-universe-detail.component.scss'],
})
export class AuditUniverseDetailComponent implements OnInit {
    constructor() {}

    AULevel1: DataAULevel1[] = [];
    AULevel2: DataAULevel2[] = [];
    AULevel3: DataAULevel3[] = [];
    AULevel4: DataAULevel4[] = [];

    ngOnInit(): void {}

    addItemLevel1(newItem: DataAULevel1[]) {
        this.AULevel1 = newItem;
    }

    addItemLevel2(newItem: DataAULevel2[]) {
        this.AULevel2 = newItem;
    }

    addItemLevel3(newItem: DataAULevel3[]) {
        this.AULevel3 = newItem;
    }

    addItemLevel4(newItem: DataAULevel4[]) {
        this.AULevel4 = newItem;
    }
}
