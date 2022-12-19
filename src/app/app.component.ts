import { Component, OnInit, isDevMode } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../app/service/auth.service';
import { environment } from '../environments/environment';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    menuMode = 'static';

    constructor(
        private primengConfig: PrimeNGConfig,
        private authService: AuthService,
        private bnIdle: BnNgIdleService,
        private router: Router
    ) {
        this.bnIdle.startWatching(1800).subscribe((res) => {
            if (res) {
                //  console.log('session expired');
                this.router.navigate(['pages/login']);
            }
        });
        if (localStorage.getItem('jwt')) {
            this.authService.setUserDetails();
        }
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
        if (isDevMode()) {
            //   console.log('Development!');
        } else {
            //   console.log('Production!');
        }
    }
}
