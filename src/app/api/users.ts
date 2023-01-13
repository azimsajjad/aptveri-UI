export interface User {
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
