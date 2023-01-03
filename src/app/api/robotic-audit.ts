import { ScriptVariable } from './libraries';

export interface AuditProgram {
    audit_program_id?: number;
    ap_name?: string;
    ap_desc?: string;
    audit_id?: number;
    au_level_3_id?: number;
    ap_schedule_date?: Date;
    ap_schedule_time?: Date;
    frequency_id?: number;
    next_run?: Date;
    last_run?: Date;
}

export interface AuditTest {
    audit_test_id?: number;
    audit_test_desc?: string;
    ap_id?: number;
    banner_id?: number;
    risk_id?: number;
    control_id?: number;
    au_level_4_id?: number;
    script_id?: number;
    script_sql?: string;
    script_presto?: string;
    strore?: true;
    result_url?: string;
    schedule_status?: true;
    schedule_start_datetime?: Date;
    schedule_end_datetime?: Date;
    last_run_date?: Date;
    target_table?: string;
    kri_id?: number;
    version_id?: number;
    kri_results?: string;
    scriptVariables?: ScriptVariable[];
    frequency: number;
    schedule_run_time: number;
}

export interface mastertable {
    tableschema?: string;
    tablename?: string;
}

export interface TableList {
    filename: null;
    path: null | string;
    tablename: string;
}
