export interface User {
    acct_status: any;
    userId: number;
    fullName: string;
    email: string;
    roleName: string;
    lastLogon: string;
    adToken?: any;
    authToken?: any;
    menuModules?: any;
}

export interface Role {
    id: number;
    role: string;
    role_description: string;
    active: boolean;
}

export interface CreateUser {
    fullName: string;
    email: string;
    roleName: Role;
    password: string;
}

export interface EditUser {
    userId: number;
    fullName: string;
    email: string;
    roleName: Role;
    password: string;
}
