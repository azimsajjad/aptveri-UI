import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuditProgram, AuditTest } from 'src/app/api/robotic-audit';
import { audit } from 'src/app/api/roboticsAudit/audit';

@Component({
    selector: 'app-audit',
    templateUrl: './audit.component.html',
    styleUrls: ['audit.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class AuditComponent implements OnInit {
    selectedAudit: audit;
    selectedAuditProgram: AuditProgram[];
    selectedAuditTest: AuditTest[];

    constructor() {}

    ngOnInit() {}

    setAuditProgram(ele: audit) {
        this.selectedAudit = ele;
    }

    setAuditTest(ele: AuditProgram[]) {
        this.selectedAuditProgram = ele;
    }

    setAuditTestHistroy(ele: AuditTest[]) {
        this.selectedAuditTest = ele;
    }
}
