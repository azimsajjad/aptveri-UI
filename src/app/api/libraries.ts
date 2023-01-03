export interface Banner {
    department_id?: number;
    department_uid?: string;
    organization?: string;
    department?: string;
}

export interface auditDetails {
    au_level_1_id?: number;
    au_level_1_uid?: string;
    au_level_1_desc?: string;
    au_level_2_uid?: string;
    au_level_2_desc?: string;
    au_level_3_uid?: string;
    au_level_3_desc?: string;
    au_level_3_definition?: string;
    au_level_3_comments?: string;
    au_level_4_uid?: string;
    au_level_4_desc?: string;
    au_level_4_definition?: string;
    au_level_4_comments?: string;
}

export interface risk {
    risk_id?: number;
    risk_uid?: string;
    au_level_3_uid?: string;
    process?: string;
    business_objective?: string;
    risk?: string;
    comment?: string;
    impact?: string;
    likelihood?: string;
    risk_score?: string;
    risk_exposure?: string;
    kri_id?: string;
    text_code_value?: string;
    auldesc?: string;
    coddesc?: string;
    rtonedesc?: string;
    rttwodesc?: string;

    auluid?: string;
    codetext?: string;
    rtax1?: string;
    rtax2?: string;
    rtaxval1?: string;
    rtaxval2?: string;
}

export interface auditunivthird {
    au_level_3_id?: number;
    au_level_3_uid?: string;
    au_level_2_id?: string;
    au_level_1_id?: string;
    au_level_3_desc?: string;
    au_level_3_definiton?: string;
    au_level_3_comments?: string;
}

export interface control {
    department_uid?: any;
    control_id?: number;
    control_uid?: string;
    au_level_4_uid?: string;
    banner_uid?: string;
    risk_uid?: string;
    control?: string;
    comments?: string;
    control_type?: string;
    frequency?: string;
    automation?: string;
    category?: string;
    assertion?: string;
    key_control?: string;
    categorydesc?: string;
    controldesc?: string;
    frequencydesc?: string;
    autodesc?: string;
    assdesc?: string;
    keydesc?: string;
    aulfdesc?: string;
    bannerdesc?: string;
    riskdesc?: string;
    created_by?: number;
    created_date?: string;
    updated_by?: number;
    updated_date?: string;

    categorytxt?: string;
    controltxt?: string;
    frequencytxt?: string;
    autotxt?: string;
    asstxt?: string;
    keytxt?: string;
    aulftxt?: string;
    bannertxt?: string;
    risktxt?: string;
}

export interface code_values {
    code_id?: number;
    code_name?: string;
    code_value_key?: number;
    text_code_value?: string;
    order_number?: number;
    active_flag?: number;
}

export interface Script {
    au_level_u_uid?: string;
    au_level_4_id?: any;
    risk_id?: any;
    banner_id?: any;
    control_id?: any;
    banner_uid?: string;
    department_id?: any;
    control_uid?: string;
    original_version_id?: string;
    output_only?: boolean;
    record_id?: any;
    record_status?: number;
    risk_uid?: string;
    role_access?: any;
    schedule_day?: string;
    schedule_status?: boolean;
    script_defination?: string;
    script_id?: number;
    script_sql?: string;
    script_presto?: string;
    start_time_interval?: number;
    start_time_interval_end?: number;
    target_table?: string;
    version?: string;
    version_id?: number;
    scriptVaribales?: ScriptVariable[];
}

export interface ScriptVariable {
    var_id?: number;
    var_value?: string;
    var_name?: string;
    var_datatype?: string;
}

export interface AuditStatusCount {
    fail: string;
    pass: string;
    pending: string;
    total: number;
}
