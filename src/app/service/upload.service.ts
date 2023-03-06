import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class UploadService {
    constructor(private http: HttpClient) {}

    sendFile(fileList): Observable<any> {
        let file: File = fileList[0];

        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
        };

        return this.http.post(
            environment.api_prefix + 'audit/upload',
            formData
        );
    }

    getUploadData(table_name: string): Observable<any> {
        return this.http.get(
            environment.api_prefix + 'audit/uploadtable/' + table_name
        );
    }

    uploadData(guid: string): Observable<any> {
        return this.http.post(
            environment.api_prefix + 'audit/exeupload/' + guid,
            {}
        );
    }

    getUploadStatus(guid: string): Observable<any> {
        return this.http.get(
            environment.api_prefix + 'audit/getlogtable/' + guid
        );
    }
}
