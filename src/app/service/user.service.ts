import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) {}

    public getAllUsers(): Observable<any> {
        return this.http.get(environment.api_prefix + 'profile/getallusers');
    }

    public getAllRole(): Observable<any> {
        return this.http.get(environment.api_prefix + 'profile/getallroles');
    }
}
