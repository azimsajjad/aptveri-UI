import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class FileService {
    private url: string = environment.api_prefix;

    constructor(private http: HttpClient) {}

    public upload(formData: FormData) {
        return this.http.post(`${this.url}/upload`, formData, {
            reportProgress: true,
            observe: 'events',
        });
    }

    public download(licenseeId: number) {
        return this.http.get(
            environment.api_prefix + 'lisence/download/' + licenseeId,
            {
                reportProgress: true,
                observe: 'events',
                responseType: 'blob',
            }
        );
    }

    public getPhotos() {
        return this.http.get(`${this.url}/getPhotos`);
    }
}
