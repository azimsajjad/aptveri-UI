import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Script } from '../api/libraries';

@Injectable()
export class ScriptService {
    constructor(private http: HttpClient) {}

    private REST_API_SERVER = environment.api_prefix + 'script/';

    getScript(id: number): Observable<any> {
        return this.http.get(this.REST_API_SERVER + id);
    }

    getAuditScript(
        risk_id: number,
        control_id: number,
        au_level_4_id: number
    ): Observable<any> {
        return this.http.get(
            this.REST_API_SERVER +
                risk_id +
                '/' +
                control_id +
                '/' +
                au_level_4_id
        );
    }

    getAutoFillFields(control_id: number): Observable<any> {
        return this.http.get(
            this.REST_API_SERVER + 'loadcontrolscript/' + control_id
        );
    }

    addScript(script: Script): Observable<any> {
        return this.http.post(this.REST_API_SERVER, script);
    }

    editScript(script: Script, record_id: number): Observable<any> {
        return this.http.put(this.REST_API_SERVER + record_id, script);
    }

    updateStatus(record_id: number) {
        return this.http.put(
            this.REST_API_SERVER + 'statusupdate/' + record_id,
            {}
        );
    }

    deleteScript(id: number, version_id: number): Observable<any> {
        return this.http.delete(this.REST_API_SERVER + id + '/' + version_id);
    }

    getProfiles() {
        return this.http.get(environment.api_prefix + 'Profile/Getallroles');
    }

    getScriptControls(organization_id: number): Observable<any> {
        return this.http.get(
            environment.api_prefix + 'script/getcontrol/' + organization_id
        );
    }
}
