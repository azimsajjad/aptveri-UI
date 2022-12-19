import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class httpInterceptor implements HttpInterceptor {
    intercept(
        request: HttpRequest<any>,
        newRequest: HttpHandler
    ): Observable<HttpEvent<any>> {
        // add authorization header to request
        //  debugger;
        //Get Token data from local storage
        const token = localStorage.getItem('jwt');
        const refreshToken = localStorage.getItem('refreshToken');

        if (token != null) {
            request = request.clone({
                setHeaders: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        // if (!request.headers.has('Content-Type')) {
        //     request = request.clone({
        //         headers: request.headers.set(
        //             'Content-Type',
        //             'application/json'
        //         ),
        //     });
        // }

        // request = request.clone({
        //     headers: request.headers.set('Accept', 'application/json'),
        // });

        return newRequest.handle(request);
    }
}
