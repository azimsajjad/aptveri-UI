export interface PageOption {
    page_id: number;
    page_name: string;
    option_id: number;
    option_name: string;
}

export interface CodeValue {
    code_id: number;
    code_name: string;
    code_value_key: number;
    text_code_value: string;
    order_number: number;
    active_flag: boolean;
    organization_id: number;
    organization: string;
}
