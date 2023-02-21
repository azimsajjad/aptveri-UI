import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PopupComponent } from '../routes/utilities/popup/popup.component';

@Injectable()
export class UtilsService {
    constructor(
        private http: HttpClient,
        private dialogService: DialogService
    ) {}

    public getPageOption(page_id: number = 0): Observable<any> {
        return this.http.get(
            environment.api_prefix + 'audit/libaraymaster/' + page_id
        );
    }

    public addLibraryDropdown(data): Observable<any> {
        return this.http.post(
            environment.api_prefix + 'libraries/addcodevalue',
            {
                code_id: data.option_id,
                code_name: data.option,
                code_value_key: 72,
                text_code_value: data.name,
                organization_id: data.organization_id,
            }
        );
    }

    public getFullView(title: string, desc: string) {
        this.dialogService.open(PopupComponent, {
            header: title,
            data: {
                text: desc,
            },
            width: '50%',
        });
    }

    public getAllCodeValue(
        organization_id: number = 0,
        code_id: number = 0,
        code_value_key: number = 0
    ): Observable<any> {
        return this.http.get(
            environment.api_prefix +
                `audit/codevalue/${organization_id}/${code_id}/${code_value_key}`
        );
    }
}
