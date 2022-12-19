export interface LoginModel {
    username: string;
    password: string;
}

export interface AuthenticatedResponse {
    token: string;
    refreshToken: string;
}

export class User {
    userName: string;
    firstName: string;
    isLoggedIn: boolean;
    role: string;
}

export enum UserRole {
    Admin = 'Admin',
    User = 'User',
}
