import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class UtilsService {
    constructor(private http: HttpClient) {}

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

    // public createLibDropdown(): Observable<any> {
    // return this.http.post(environment.api_prefix+)
    // }
}
