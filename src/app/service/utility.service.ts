import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    AddEditLicense,
    AddOrgBody,
    EditOrgBody,
} from '../api/utilities.model';

@Injectable()
export class UtilityService {
    constructor(private http: HttpClient) {}

    public getAllOrganizations(id?: string | number): Observable<any> {
        let url = environment.api_prefix + 'libraries/loadorganizations';

        if (id) {
            url += '/' + id;
        }

        return this.http.get(url);
    }

    public addOrganization(organization: AddOrgBody): Observable<any> {
        return this.http.post(
            environment.api_prefix + 'libraries/addorganizations',
            organization
        );
    }

    public editOrganization(organization: EditOrgBody): Observable<any> {
        return this.http.put(
            environment.api_prefix + 'libraries/putorganization',
            organization
        );
    }

    public deleteOrganization(id: any): Observable<any> {
        return this.http.delete(
            environment.api_prefix + 'libraries/deleteorganization/' + id
        );
    }

    public getAllLicense(id: number = 0): Observable<any> {
        return this.http.get(environment.api_prefix + 'lisence/' + id);
    }

    public addLicense(data: AddEditLicense): Observable<any> {
        return this.http.post(environment.api_prefix + 'lisence/addlicences', {
            licensor: data.licensor,
            licensee: data.licensee,
            licensee_id: data.licensee_id,
            licensetype: data.licensetype,
            issuedate: data.issuedate,
            expiration: data.expiration,
            servername: data.servername,
            datasource: data.datasource,
            organisation: data.organisation,
            department: data.department,
            script: data.script,
            connection: data.connection,
            audit: data.audit,
            ondemand_exc: data.ondemand_exc,
            schedule_exc: data.schedule_exc,
        });
    }

    public editLicense(data: AddEditLicense): Observable<any> {
        return this.http.put(environment.api_prefix + 'lisence/putlicence', {
            licenceid: data.licenseid,
            licensor: data.licensor,
            licensee: data.licensee,
            licensee_id: data.licensee_id,
            licensetype: data.licensetype,
            issuedate: data.issuedate,
            expiration: data.expiration,
            servername: data.servername,
            datasource: data.datasource,
            organisation: data.organisation,
            department: data.department,
            script: data.script,
            connection: data.connection,
            audit: data.audit,
            ondemand_exc: data.ondemand_exc,
            schedule_exc: data.schedule_exc,
        });
    }

    public deleteLicense(licenseId: number) {
        return this.http.delete(
            environment.api_prefix +
                'lisence/updatelicencestatus/' +
                licenseId +
                '/0'
        );
    }
}
