import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class FileService {
    // private url: string = 'https://localhost:7204/api/';
    private REST_API_SERVER = environment.api_prefix;
    constructor(private http: HttpClient) {}

    public upload(formData: FormData) {
        return this.http.post(`${this.REST_API_SERVER}/Auth/upload`, formData, {
            reportProgress: true,
            observe: 'events',
        });
    }

    public download(fileUrl: string) {
        return this.http.get(
            `${this.REST_API_SERVER}Auth/download?fileUrl=${fileUrl}`,
            {
                reportProgress: true,
                observe: 'events',
                responseType: 'blob',
            }
        );
    }

    public getPhotos() {
        return this.http.get(`${this.REST_API_SERVER}/getPhotos`);
    }
}
