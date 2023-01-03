import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-logs',
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
    constructor(private http: HttpClient) {}

    data;

    ngOnInit(): void {
        this.http
            .get(
                environment.api_prefix +
                    'auditUniverse/getaudituniverselevelall'
            )
            .pipe(map((res: any) => res.data))
            .subscribe((res) => {
                console.log(res);
                this.data = res.data;
            });
    }
}
