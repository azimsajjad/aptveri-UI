import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { auditDetails } from 'src/app/api/libraries';
import { AuthService } from 'src/app/service/auth.service';
import { BannerService } from 'src/app/service/librariesservice';

@Component({
    selector: 'app-au-level-all',
    templateUrl: './au-level-all.component.html',
    styleUrls: ['./au-level-all.component.scss'],
    providers: [MessageService],
})
export class AuLevelAllComponent implements OnInit {
    constructor(
        private auditDetailsService: BannerService,
        public accountSvr: AuthService
    ) {}
    auditDetailsDialog: boolean;
    deleteauditDetails: boolean = false;
    submitted: boolean;
    loading: boolean = true;

    auditDetails: auditDetails[];
    dataauditDetails: auditDetails;
    auditDetail: auditDetails;
    selectedauditDetails: auditDetails[];

    @ViewChild('dt1') table: Table;
    @ViewChild('filter') filter: ElementRef;

    statuses: any[];
    cols: any[];

    rowsPerPageOptions = [5, 10, 20];

    ngOnInit(): void {
        this.getaudit();
        this.cols = [
            { field: 'au_level_1_id', header: 'AU level 1 ID' },
            { field: 'au_level_1_uid', header: 'AU level 1 UID' },
            { field: 'au_level_1_desc', header: 'AU level 1 Desc' },
            { field: 'au_level_2_uid', header: 'AU level 2 UID' },
            { field: 'au_level_2_desc', header: 'AU level 2  Desc' },
            { field: 'au_level_3_uid', header: 'AU level 3 UID' },
            { field: 'au_level_3_desc', header: 'AU level 3  Desc' },
            { field: 'au_level_3_definition', header: 'AU level_1 Definition' },
            { field: 'au_level_3_comments', header: 'AU level 3  Comments' },
            { field: 'au_level_4_uid', header: 'AU level 4 UID' },
            { field: 'au_level_4_desc', header: 'AU level 4  Desc' },
            { field: 'au_level_4_definition', header: 'AU level_1 Definition' },
            { field: 'au_level_4_comments', header: 'AU level 2 Comments' },
        ];
    }

    getaudit() {
        this.auditDetailsService
            .sendGetRequestForAuditUniverseall()
            .subscribe((result: any) => {
                this.auditDetails = result.data.data;
                this.loading = false;
            });
    }

    clear(table: Table) {
        table.clear();
    }

    filters: [
        {
            name: 'string';
            value: 'string';
            operation: 'string';
            orderBy: 'string';
        }
    ];
}
