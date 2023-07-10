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
        return newRequest.handle(request);
    }
}
