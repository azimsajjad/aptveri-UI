import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class UtilsService {
    constructor(private http: HttpClient) {}

    // public createLibDropdown(): Observable<any> {
    // return this.http.post(environment.api_prefix+)
    // }
}
