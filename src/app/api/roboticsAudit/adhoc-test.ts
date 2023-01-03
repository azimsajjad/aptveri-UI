import { ScriptVariable } from '../libraries';

export interface AddAdhocTest {
    adhoctest_desc?: String;
    au_level_4_id?: number;
    script_id?: number;
    banner_id?: number;
    presto_script?: String;
    sql_script?: String;
    target_table_name?: String;
    store?: true;
    scriptVariables?: ScriptVariable[];
}

export interface AdhocTest {
    adhoc_run_status?: string;
    adhoc_test_results?: string;
    adhoctest_desc?: string;
    adhoctest_id?: number;
    adhoctest_uid?: string;
    au_level_4_desc?: string;
    au_level_4_id?: number;
    au_level_4_uid?: string;
    banner?: string;
    banner_id?: number;
    banner_uid?: string;
    created_by?: number;
    created_date?: null;
    delete_flag?: boolean;
    job_run_status?: string;
    last_run?: null;
    notes?: string;
    presto_script?: null | string;
    replaced_presto_script?: null | string;
    replaced_sql_script?: null | string;
    run_datetime?: null;
    script_defination?: string;
    script_id?: number;
    script_uid?: string;
    sql_script?: string;
    store?: boolean;
    target_table_name?: string;
    updated_by?: number;
    updated_date?: null | string;
    user_id_created?: string;
}
export interface EditAdhocTest {
    adhoctest_id?: number;
    notes?: string;
    results?: string;
}
export interface JobRunStatus {
    codeId: number;
    codeName: string;
}
