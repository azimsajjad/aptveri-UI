import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuditUniverseService {
    constructor(private http: HttpClient) {}

    getAuditUniverseLevel4Script(au_level_3_id: number): Observable<any> {
        return this.http.get(
            environment.api_prefix +
                'AuditUniverse/GetAuditUniverseLevelFour/' +
                au_level_3_id
        );
    }

    getAuditUniverseLevel3Script(au_level_2_uid: number): Observable<any> {
        return this.http.get(
            environment.api_prefix +
                'AuditUniverse/GetAuditUniverseLevelThreeBasedScript/' +
                au_level_2_uid
        );
    }

    getAuditUniverseLevel3_audit(au_level_2_uid: number): Observable<any> {
        return this.http.get(
            environment.api_prefix +
                'AuditUniverse/GetAuditUniverseLevel3_audit/' +
                au_level_2_uid
        );
    }

    getControlAudit(risk_id: number): Observable<any> {
        return this.http.get(
            environment.api_prefix + 'libraries/loadriskau/' + risk_id
        );
    }
}
