export interface Organization {
    organization_id: number;
    organization_uid: string;
    organization: string;
    organization_description: string;
    created_by: number;
    created_date: string;
    updated_by: number;
    updated_date: string;
}

export interface AddOrgBody {
    organization: string;
    organization_description: string;
}

export interface EditOrgBody {
    organization_uid: string;
    organization: string;
    organization_description: string;
}

export interface License {
    audit: number;
    connection: number;
    datasource: string;
    department: number;
    expiration: string;
    is_active: boolean;
    issuedate: string;
    licenceid: number;
    licensee: string;
    licensee_id: number;
    licensetype: string;
    licensor: string;
    ondemand_exc: number;
    organisation: number;
    schedule_exc: number;
    script: number;
    servername: string;
    signature: string;
}

export interface AddEditLicense {
    licenseid?: number;
    licensor: string;
    licensee: string;
    licensee_id: number;
    licensetype: string;
    issuedate: string;
    expiration: string;
    servername: string;
    datasource: string;
    organisation: number;
    department: number;
    script: number;
    connection: number;
    audit: number;
    ondemand_exc: number;
    schedule_exc: number;
}

export interface LicensePushEmail {
    to: string;
    cc: string;
    message: string;
    licenceid: string;
}
