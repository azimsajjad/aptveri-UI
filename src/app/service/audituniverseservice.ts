import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    AddAUL_1,
    AddAUL_2,
    AddAUL_3,
    AddAUL_4,
    EditAUL_1,
    EditAUL_2,
    EditAUL_3,
    EditAUL_4,
} from '../api/auditUniverse';

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

    getAuditUniverseLevel1(): Observable<any> {
        return this.http.get(
            environment.api_prefix + 'libraries/' + 'loadAuditunivone'
        );
    }

    addAuditUniverseLevel1(aul_1: AddAUL_1): Observable<any> {
        return this.http.post(
            environment.api_prefix + 'AuditUniverse/addAuditUniverseLevel1',
            {
                au_level_1_desc: aul_1.au_level_1_desc,
                section_no: aul_1.section_no.toString(),
            }
        );
    }

    editAuditUniverseLevel1(aul_1: EditAUL_1): Observable<any> {
        return this.http.put(
            environment.api_prefix + 'AuditUniverse/putaddAuditUniverseLevel1',
            {
                au_level_1_id: aul_1.au_level_1_id,
                au_level_1_desc: aul_1.au_level_1_desc,
                section_no: aul_1.section_no.toString(),
            }
        );
    }

    deleteAuditUniverseLevel1(au_level_1_id: number): Observable<any> {
        return this.http.delete(
            environment.api_prefix +
                'AuditUniverse/deleteaddAuditUniverseLevel1/' +
                au_level_1_id
        );
    }

    getAuditUniverseLevel2(au_level_1_id: number): Observable<any> {
        return this.http.get(
            environment.api_prefix + 'libraries/loadAudit2/' + au_level_1_id
        );
    }

    addAuditUniverseLevel2(aul_2: AddAUL_2): Observable<any> {
        return this.http.post(
            environment.api_prefix + 'AuditUniverse/addAuditUniverseLevel2',
            {
                au_level_1_id: aul_2.au_level_1_id,
                au_level_2_desc: aul_2.au_level_2_desc,
                section_no: aul_2.section_no.toString(),
                updated_date: new Date(),
            }
        );
    }

    editAuditUniverseLevel2(aul_2: EditAUL_2): Observable<any> {
        return this.http.put(
            environment.api_prefix + 'AuditUniverse/putaddAuditUniverseLevel2',
            {
                au_level_2_id: aul_2.au_level_2_id,
                au_level_1_id: aul_2.au_level_1_id,
                au_level_2_desc: aul_2.au_level_2_desc,
                section_no: aul_2.section_no,
            }
        );
    }

    deleteAuditUniverseLevel2(au_level_2_id: number): Observable<any> {
        return this.http.delete(
            environment.api_prefix +
                'AuditUniverse/deleteaddAuditUniverseLevel2/' +
                au_level_2_id
        );
    }

    getAuditUniverseLevel3(au_level_2_uid: number): Observable<any> {
        return this.http.get(
            environment.api_prefix + 'libraries/loadAudit3/' + au_level_2_uid
        );
    }

    addAuditUniverseLevel3(aul_3: AddAUL_3): Observable<any> {
        return this.http.post(
            environment.api_prefix + 'AuditUniverse/addAuditUniverseLevel3',
            {
                au_level_1_id: aul_3.au_level_1_id,
                au_level_2_id: aul_3.au_level_2_id,
                au_level_3_uid: aul_3.au_level_3_uid,
                au_level_3_desc: aul_3.au_level_3_desc,
                au_level_3_definiton: aul_3.au_level_3_definiton,
                au_level_3_comments: aul_3.au_level_3_comments,
                section_no: aul_3.section_no.toString(),
            }
        );
    }

    editAuditUniverseLevel3(aul_3: EditAUL_3): Observable<any> {
        return this.http.put(
            environment.api_prefix + 'AuditUniverse/putaddAuditUniverseLevel3',
            {
                au_level_1_id: aul_3.au_level_1_id,
                au_level_2_id: aul_3.au_level_2_id,
                au_level_3_id: aul_3.au_level_3_id,
                au_level_3_uid: aul_3.au_level_3_uid,
                au_level_3_desc: aul_3.au_level_3_desc,
                au_level_3_definiton: aul_3.au_level_3_definiton,
                au_level_3_comments: aul_3.au_level_3_comments,
                section_no: aul_3.section_no.toString(),
            }
        );
    }

    deleteAuditUniverseLevel3(au_level_3_id: number): Observable<any> {
        return this.http.delete(
            environment.api_prefix +
                'AuditUniverse/deleteaddAuditUniverseLevel3/' +
                au_level_3_id
        );
    }

    getAuditUniverseLevel4(au_level_3_id: number): Observable<any> {
        return this.http.get(
            environment.api_prefix + 'libraries/loadAudit4/' + au_level_3_id
        );
    }

    addAuditUniverseLevel4(aul_4: AddAUL_4): Observable<any> {
        return this.http.post(
            environment.api_prefix + 'AuditUniverse/addaudituniverselevel4',
            {
                au_level_1_id: aul_4.au_level_1_id,
                au_level_2_id: aul_4.au_level_2_id,
                au_level_3_id: aul_4.au_level_3_id,
                au_level_4_desc: aul_4.au_level_4_desc,
                au_level_4_definiton: aul_4.au_level_4_definiton,
                au_level_4_comments: aul_4.au_level_4_comments,
                section_no: aul_4.section_no.toString(),
            }
        );
    }

    editAuditUniverseLevel4(aul_4: EditAUL_4): Observable<any> {
        return this.http.put(
            environment.api_prefix + 'AuditUniverse/putaddaudituniverselevel4',
            {
                au_level_1_id: aul_4.au_level_1_id,
                au_level_2_id: aul_4.au_level_2_id,
                au_level_3_id: aul_4.au_level_3_id,
                au_level_4_id: aul_4.au_level_4_id,
                au_level_4_desc: aul_4.au_level_4_desc,
                au_level_4_definiton: aul_4.au_level_4_definiton,
                au_level_4_comments: aul_4.au_level_4_comments,
                section_no: aul_4.section_no.toString(),
            }
        );
    }

    deleteAuditUniverseLevel4(au_level_4_id: number): Observable<any> {
        return this.http.delete(
            environment.api_prefix +
                'AuditUniverse/deleteaddAuditUniverseLevel4/' +
                au_level_4_id
        );
    }
}
