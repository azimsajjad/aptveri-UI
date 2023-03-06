import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddAdhocTest, EditAdhocTest } from '../api/roboticsAudit/adhoc-test';

@Injectable()
export class AdhocService {
    constructor(private http: HttpClient) {}

    getJobRunStatus(): Observable<any> {
        return this.http.get(environment.api_prefix + 'audit/jobrunstatus');
    }

    getAdhocTest(adhoc_id: number = 0): Observable<any> {
        return this.http.get(environment.api_prefix + 'adhoc/' + adhoc_id);
    }

    addAdhocTest(adhoc_test: AddAdhocTest): Observable<any> {
        return this.http.post(environment.api_prefix + 'adhoc/adhoctest', {
            adhoctest_desc: adhoc_test.adhoctest_desc,
            au_level_4_id: adhoc_test.au_level_4_id,
            script_id: adhoc_test.script_id,
            banner_id: adhoc_test.banner_id,
            presto_script: adhoc_test.presto_script,
            sql_script: adhoc_test.sql_script,
            target_table_name: adhoc_test.target_table_name,
            store: adhoc_test.store,
            scriptVariables: adhoc_test.scriptVariables,
        });
    }

    editAdhocTest(adhoc_test: EditAdhocTest) {
        return this.http.put(
            environment.api_prefix +
                'adhoc/adhoctest/' +
                adhoc_test.adhoctest_id,
            {
                notes: adhoc_test.notes,
                results: adhoc_test.results,
            }
        );
    }

    runAdhocTest(adhoc_test_ids: Array<number>): Observable<any> {
        return this.http.post(
            environment.api_prefix + 'adhoc/adhoctestrun',
            adhoc_test_ids
        );
    }

    deleteAdhocTest(adhoc_id: number): Observable<any> {
        return this.http.delete(
            environment.api_prefix + 'Adhoc/AdhocTest/' + adhoc_id
        );
    }
}
