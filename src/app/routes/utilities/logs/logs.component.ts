import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { User } from 'src/app/api/users';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-logs',
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
    constructor(private http: HttpClient) {}

    data;
    users: User[];

    ngOnInit(): void {
         let user = this.http.get(
            environment.api_prefix + 'profile/getallusers'
        );
        let logs = this.http.get(environment.api_prefix + 'audit/log/0');

        forkJoin([user, logs]).subscribe((result: any) => {
            this.users = result[0].data;
            // this.data = result[1].data;

            this.data = result[1].data.map((log) => {
                const user = this.users.find(
                    (user) => user.userId === log.user_id
                );
                return { ...log, username: user.fullName };
            });
            console.log(this.data);
            });
    }
}
