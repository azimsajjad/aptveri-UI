import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditProgram, AuditTest } from '../api/robotic-audit';
import { audit } from '../api/roboticsAudit/audit';

@Injectable()
export class AuditService {
    constructor(private http: HttpClient) {}

    getFrequency(): Observable<any> {
        return this.http.get(environment.api_prefix + 'Audit/Frequency');
    }

    getAuditProgram(aduitProgramId: number, auditId: number): Observable<any> {
        return this.http.get(
            environment.api_prefix +
                'Audit/' +
                'Program/' +
                aduitProgramId +
                '/' +
                auditId
        );
    }

    changeAuditScheduleStatus(
        program_id: number,
        status: number
    ): Observable<any> {
        return this.http.put(
            environment.api_prefix +
                'audit/programstatus/' +
                program_id +
                '/' +
                status,
            {}
        );
    }

    getAuditTest(audit_test_id: number, audit_program_id: number) {
        return this.http.get(
            environment.api_prefix +
                'Audit/' +
                'Test/' +
                audit_test_id +
                '/' +
                audit_program_id
        );
    }

    getScriptUniLevel4(au_level_3_id: number): Observable<any> {
        return this.http.get(
            environment.api_prefix +
                'Audit/' +
                'getscriptunilevel4/' +
                au_level_3_id
        );
    }

    getScriptRisk(au_level_4_id: number): Observable<any> {
        return this.http.get(
            environment.api_prefix + 'Audit/getscriptrisk/' + au_level_4_id
        );
    }

    getScriptControl(au_level_4_id: number, risk_id: number): Observable<any> {
        return this.http.get(
            environment.api_prefix +
                'Audit/getscriptcontrol/' +
                au_level_4_id +
                '/' +
                risk_id
        );
    }

    addAuditProgram(auditProgram: AuditProgram): Observable<any> {
        return this.http.post(environment.api_prefix + 'Audit/Program', {
            ap_name: auditProgram.ap_name,
            ap_desc: auditProgram.ap_desc,
            audit_id: auditProgram.audit_id,
            au_level_3_id: auditProgram.au_level_3_id,
            ap_schedule_date: auditProgram.ap_schedule_date || new Date(),
            ap_schedule_time: auditProgram.ap_schedule_time || 0,
            frequency_id: auditProgram.frequency_id || 0,
            next_run: auditProgram.next_run || new Date(),
            last_run: auditProgram.last_run || new Date(),
        });
    }

    editAuditProgram(auditProgram: AuditProgram): Observable<any> {
        return this.http.put(
            environment.api_prefix +
                'Audit/Program/' +
                auditProgram.audit_program_id,
            {
                ap_name: auditProgram.ap_name,
                ap_desc: auditProgram.ap_desc,
                audit_id: auditProgram.audit_id,
                au_level_3_id: auditProgram.au_level_3_id,
                ap_schedule_date: auditProgram.ap_schedule_date,
                ap_schedule_time: auditProgram.ap_schedule_time,
                frequency_id: auditProgram.frequency_id,
                next_run: auditProgram.next_run || new Date(),
                last_run: auditProgram.last_run,
            }
        );
    }

    deleteProgram(program_id: number): Observable<any> {
        return this.http.delete(
            environment.api_prefix + 'Audit/Program/' + program_id
        );
    }

    addAuditTest(auditTest: AuditTest): Observable<any> {
        debugger;
        return this.http.post(environment.api_prefix + 'Audit/Test', {
            audit_test_desc: auditTest.audit_test_desc,
            ap_id: auditTest.ap_id,
            risk_id: auditTest.risk_id,
            control_id: auditTest.control_id,
            au_level_4_id: auditTest.au_level_4_id,
            script_id: auditTest.script_id,
            script_sql: auditTest.script_sql,
            script_presto: auditTest.script_presto,
            strore: auditTest.strore,
            schedule_status: auditTest.schedule_status,
            schedule_start_datetime:
                auditTest.schedule_start_datetime || new Date(),
            schedule_end_datetime:
                auditTest.schedule_end_datetime || new Date(),
            last_run_date: auditTest.last_run_date,
            scriptVariables: auditTest.scriptVariables,
            target_table: auditTest.target_table,
            banner_id: auditTest.department_id,
            version_id: auditTest.version_id,
            frequency: 0,
            schedule_run_time: 0,
            organization_id: auditTest.organization_id,
        });
    }

    editAuditTest(auditTest: AuditTest): Observable<any> {
        return this.http.put(
            environment.api_prefix + 'Audit/Test/' + auditTest.audit_test_id,
            {
                audit_test_desc: auditTest.audit_test_desc,
                ap_id: auditTest.ap_id,
                risk_id: auditTest.risk_id,
                control_id: auditTest.control_id,
                au_level_4_id: auditTest.au_level_4_id,
                script_id: auditTest.script_id,
                script_sql: auditTest.script_sql,
                strore: auditTest.strore,
                schedule_status: auditTest.schedule_status,
                schedule_start_datetime: auditTest.schedule_start_datetime,
                schedule_end_datetime: auditTest.schedule_end_datetime,
                last_run_date: auditTest.last_run_date,
                scriptVariables: auditTest.scriptVariables,
                script_presto: '',
                version_id: auditTest.version_id,
                frequency: auditTest.frequency || 0,
                schedule_run_time: auditTest.schedule_run_time,
                organization_id: auditTest.organization_id,
            }
        );
    }

    scheduleTest(auditTest: AuditTest): Observable<any> {
        return this.http.post(environment.api_prefix + 'audit/scheduletest', {
            audit_test_desc: auditTest.audit_test_desc,
            ap_id: auditTest.ap_id,
            risk_id: auditTest.risk_id,
            control_id: auditTest.control_id,
            au_level_4_id: auditTest.au_level_4_id,
            script_id: auditTest.script_id,
            script_sql: auditTest.script_sql,
            script_presto: auditTest.script_presto,
            strore: auditTest.strore,
            schedule_status: auditTest.schedule_status,
            schedule_start_datetime:
                auditTest.schedule_start_datetime || new Date(),
            schedule_end_datetime:
                auditTest.schedule_end_datetime || new Date(),
            last_run_date: auditTest.last_run_date,
            scriptVariables: auditTest.scriptVariables,
            target_table: auditTest.target_table,
            banner_id: auditTest.banner_id,
            version_id: auditTest.version_id,
            frequency: auditTest.frequency || null,
            schedule_run_time: auditTest.schedule_run_time,
            organization_id: auditTest.organization_id,
        });
    }

    runAuditTest(audit_test_ids: Array<number>): Observable<any> {
        return this.http.post(
            environment.api_prefix + 'Audit/TestHistoryRun',
            audit_test_ids
        );
    }

    deleteAuditTest(audit_test_id: number): Observable<any> {
        return this.http.delete(
            environment.api_prefix + 'Audit/Test/' + audit_test_id
        );
    }

    getAuditTestHistory(
        audit_test_history_id: number,
        audit_test_id: number
    ): Observable<any> {
        return this.http.get(
            environment.api_prefix +
                'Audit/TestHistory/' +
                audit_test_history_id +
                '/' +
                audit_test_id
        );
    }

    getAuditTestHistoryenew(
        audit_test_history_id: number,
        audit_test_id: number
    ): Observable<any> {
        return this.http.get(
            environment.api_prefix +
                'Audit/ExcelTestHistory/' +
                audit_test_history_id +
                '/' +
                audit_test_id
        );
    }

    getAuditTestHisexce(
        audit_test_history_id: number,
        audit_test_id: number
    ): Observable<any> {
        return this.http.get(
            environment.api_prefix +
                'Audit/getAuditTestExcel/' +
                audit_test_history_id +
                '/' +
                audit_test_id
        );
    }

    getExcelTestHistoryresult(
        audit_test_id: number,
        audit_program_id: number
    ): Promise<any> {
        return this.http
            .get(
                environment.api_prefix +
                    'Audit/' +
                    'ExcelTestHistory/' +
                    audit_test_id +
                    '/' +
                    audit_program_id
            )
            .toPromise();
    }

    // public getExcelTestHistoryresult(
    //     audit_test_id: number,
    //     audit_program_id: number
    // ) {
    //     return this.http.get(
    //         environment.api_prefix +
    //             'Audit/' +
    //             'ExcelTestHistory/' +
    //             audit_test_id +
    //             '/' +
    //             audit_program_id
    //     );
    // }

    editAuditTestHistory(
        audit_test_history_id: number,
        notes: string,
        result: string
    ): Observable<any> {
        return this.http.put(
            environment.api_prefix +
                'Audit/TestHistory/' +
                audit_test_history_id,
            { notes: notes, results: result }
        );
    }

    deleteAuditTestHistory(audit_test_history_id: number): Observable<any> {
        return this.http.delete(
            environment.api_prefix +
                'Audit/TestHistory/' +
                audit_test_history_id
        );
    }

    getChart(audit_program_ids: Array<number>): Observable<any> {
        return this.http.post(
            environment.api_prefix + 'Audit/AuditCharts',
            audit_program_ids
        );
    }

    public sendGetAllAuditRequest() {
        return this.http.get(`${environment.api_prefix + 'Audit/'}0`);
    }

    public sendGetAuditRequest(id: string) {
        return this.http.get(`${environment.api_prefix + 'Audit/'}${id}`);
    }

    public sendPostAuditRequest(data: audit): Observable<any> {
        return this.http.post<audit>(
            `${environment.api_prefix + 'Audit/'}`,
            data
        );
    }

    public sendPutAuditRequest(id: number, data: audit): Observable<any> {
        // debugger;
        return this.http.put<audit>(
            `${environment.api_prefix + 'Audit/'}${id}`,
            data
        );
    }

    public sendDeleteAuditRequest(id: number): Observable<any> {
        return this.http.delete(`${environment.api_prefix + 'Audit/'}${id}`);
    }

    //Get the banner data
    public sendGetBannerRequest() {
        return this.http.get(
            `${environment.api_prefix}libraries/loaddepartments`
        );
    }

    //Get the AuditUniverse data
    public sendGetAuditUniverseRequest() {
        return this.http.get(
            `${environment.api_prefix}AuditUniverse/GetAuditUniverseLevelTwoBasedScript/0`
        );
    }

    public getAuditUniverseLevel2(id: number): Observable<any> {
        return this.http.get(
            `${environment.api_prefix}AuditUniverse/GetAuditUniverseLevelTwo/` +
                id
        );
    }

    //Get the AuditUniverse data
    public sendGetallusersRequest() {
        return this.http.get(`${environment.api_prefix}Profile/Getallusers`);
    }

    public sendGetauditRequest(id: number): Observable<any> {
        return this.http.get(`${environment.api_prefix + 'Audit/'}${id}`);
    }

    getAuditTestresult(
        audit_test_id: number,
        audit_program_id: number
    ): Observable<any> {
        return this.http.get(
            environment.api_prefix +
                'Audit/' +
                'Test/' +
                audit_test_id +
                '/' +
                audit_program_id
        );
    }

    getAuditexcelTestresult(
        audit_test_id: number,
        audit_program_id: number
    ): Observable<any> {
        return this.http.get(
            environment.api_prefix +
                'Audit/' +
                'excelTest/' +
                audit_test_id +
                '/' +
                audit_program_id
        );
    }

    public sendGettargettableRequest(id: string): Observable<any> {
        return this.http.get(
            `${environment.api_prefix + 'Audit/' + 'TargetTable/'}${id}`
        );
    }

    public sendGettargettblRequest(
        id: string,
        auditthid: string
    ): Observable<any> {
        return this.http.get(
            `${
                environment.api_prefix + 'Audit/' + 'TargetTbl/'
            }${id}/${auditthid}`
        );
    }

    public checktargettable(id: string): Observable<any> {
        return this.http.get(
            `${environment.api_prefix + 'Audit/' + 'CheckTargetTable/'}${id}`
        );
    }

    public GetmastertableRequest(id: string): Observable<any> {
        return this.http.get(
            `${environment.api_prefix + 'Audit/' + 'MasterTable/'}${id}`
        );
    }

    targettableatid(id: string, auditthid: string): Promise<any> {
        return this.http
            .get(
                `${
                    environment.api_prefix + 'Audit/' + 'Targettabletestid/'
                }${id}/${auditthid}`
            )
            .toPromise();
    }

    TargetTbladh(id: string, auditthid: string): Promise<any> {
        return this.http
            .get(
                `${
                    environment.api_prefix + 'Audit/' + 'TargetTbladh/'
                }${id}/${auditthid}`
            )
            .toPromise();
    }

    checktargettablenew(id: string): Promise<any> {
        return this.http
            .get(
                `${
                    environment.api_prefix + 'Audit/' + 'CheckTargetTable/'
                }${id}`
            )
            .toPromise();
    }

    sendGettargettableRequestnew(id: string): Promise<any> {
        return this.http
            .get(`${environment.api_prefix + 'Audit/' + 'TargetTable/'}${id}`)
            .toPromise();
    }

    GetmastertableRequestnew(id: string): Promise<any> {
        return this.http
            .get(`${environment.api_prefix + 'Audit/' + 'MasterTable/'}${id}`)
            .toPromise();
    }

    getAllAuditStatus(): Observable<any> {
        return this.http.get(environment.api_prefix + 'audit/auditcount');
    }

    getDashboardURL(): Observable<any> {
        return this.http.get(environment.api_prefix + 'audit/getdashboard');
    }

    public sendNavigateAuditRequest(
        id: number,
        isuser: string
    ): Observable<any> {
        return this.http.get(
            `${environment.api_prefix + 'Audit/Navigate/'}${id}/${isuser}`
        );
    }

    public getAuditDashboard(
        organization_id: number = 0,
        department_id: number = 0,
        ap_schedule_start_date: any = 0,
        ap_schedule_end_date: any = 0,
        results: 'pass' | 'fail' | 0 = 0
    ): Observable<any> {
        return this.http.get(
            environment.api_prefix +
                `audit/auditreport/${organization_id}/${department_id}/${ap_schedule_start_date}/${ap_schedule_end_date}/${results}`
        );
    }

    public downloadCSV(
        organization_id: number = 0,
        department_id: number = 0,
        ap_schedule_start_date: any = 0,
        ap_schedule_end_date: any = 0,
        results: 'pass' | 'fail' | 0 = 0
    ): Observable<any> {
        return this.http.get(
            environment.api_prefix +
                `audit/auditdashbord/${organization_id}/${department_id}/${ap_schedule_start_date}/${ap_schedule_end_date}/${results}`,
            {
                observe: 'response',
                responseType: 'blob',
            }
        );
    }
}
