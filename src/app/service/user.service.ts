import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateUser, EditUser } from '../api/users';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) {}

    public getAllUsers(): Observable<any> {
        return this.http.get(environment.api_prefix + 'profile/getallusers');
    }

    public getAllRole(): Observable<any> {
        return this.http.get(environment.api_prefix + 'profile/getallroles');
    }

    public addUser(user: CreateUser): Observable<any> {
        return this.http.post(environment.api_prefix + 'profile/addusers', {
            fullName: user.fullName,
            email: user.email,
            roleName: user.roleName.role,
            password: user.password,
        });
    }

    public editUser(user: EditUser): Observable<any> {
        return this.http.put(environment.api_prefix + 'profile/putuser', {
            userId: user.userId,
            fullName: user.fullName,
            email: user.email,
            roleName: user.roleName.role,
            password: user.password,
        });
    }

    public disableUser(userId: number, status: boolean): Observable<any> {
        return this.http.delete(
            environment.api_prefix +
                `profile/updateuserstatus/${userId}/${status == true ? 1 : 0}`
        );
    }
}
