export interface AULevel1 {
    code?: number;
    data?: DataAULevel1[];
    message?: string;
}

export interface DataAULevel1 {
    au_level_1_desc?: string;
    au_level_1_id?: number;
    au_level_1_uid?: null | string;
    created_by?: number;
    created_date?: string;
    section_no?: null | string;
    updated_by?: number;
    updated_date?: null | string;
}

export interface AULevel2 {
    code?: number;
    data?: DataAULevel2[];
    message?: string;
}

export interface DataAULevel2 {
    au_level_1_id?: number;
    au_level_2_desc?: string;
    au_level_2_id?: number;
    au_level_2_uid?: string;
    created_by?: number;
    created_date?: string;
    section_no?: string;
    updated_by?: number;
    updated_date?: null;
}

export interface AULevel3 {
    data?: DataAULevel3[];
    totalCount?: number;
}

export interface DataAULevel3 {
    au_level_1_id?: number;
    au_level_2_id?: number;
    au_level_3_comments?: string;
    au_level_3_definiton?: string;
    au_level_3_desc?: string;
    au_level_3_id?: number;
    au_level_3_uid?: string;
    created_by?: number;
    created_date?: string;
    section_no?: string;
    updated_by?: number;
    updated_date?: string;
}

export interface AULevel4 {
    data?: DataAULevel4[];
    totalCount?: number;
}

export interface DataAULevel4 {
    au_level_1_id?: number;
    au_level_2_id?: number;
    au_level_3_id?: number;
    au_level_4_comments?: string;
    au_level_4_definiton?: string;
    au_level_4_desc?: string;
    au_level_4_id?: number;
    au_level_4_uid?: string;
    created_by?: number;
    created_date?: string;
    section_no?: string;
    updated_by?: number;
    updated_date?: string;
}

export interface AddAUL_1 {
    au_level_1_desc?: string;
    section_no?: string;
}

export interface EditAUL_1 {
    au_level_1_id?: number;
    au_level_1_desc?: string;
    section_no?: string;
}

export interface AddAUL_2 {
    au_level_1_id: number;
    au_level_2_desc: string;
    section_no: string;
}

export interface EditAUL_2 {
    au_level_1_id?: number;
    au_level_2_id?: number;
    au_level_2_desc?: string;
    section_no?: string;
}

export interface AddAUL_3 {
    au_level_1_id: number;
    au_level_2_id: number;
    au_level_3_uid: string;
    au_level_3_desc: string;
    au_level_3_definiton: string;
    au_level_3_comments: string;
    section_no: string;
}

export interface EditAUL_3 {
    au_level_1_id: number;
    au_level_2_id: number;
    au_level_3_id: number;
    au_level_3_uid: string;
    au_level_3_desc: string;
    au_level_3_definiton: string;
    au_level_3_comments: string;
    section_no: string;
}

export interface AddAUL_4 {
    au_level_1_id: number;
    au_level_2_id: number;
    au_level_3_id: number;
    au_level_4_desc: string;
    au_level_4_definiton: string;
    au_level_4_comments: string;
    section_no: string;
}

export interface EditAUL_4 {
    au_level_1_id: number;
    au_level_2_id: number;
    au_level_3_id: number;
    au_level_4_id: number;
    au_level_4_desc: string;
    au_level_4_definiton: string;
    au_level_4_comments: string;
    section_no: string;
}
