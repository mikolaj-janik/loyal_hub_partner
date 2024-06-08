import { Component, inject, OnInit, NgModule } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-loyalty-button',
  standalone: true,
  imports: [],
  templateUrl: './loyalty-button.component.html',
  styleUrl: './loyalty-button.component.css'
})
export class LoyaltyButtonComponent {
  authService = inject(AuthService);
  router = inject(Router);
  isLoggedIn! : boolean;
  isLoyaltyRoute: boolean = false;
  name = ''

  
  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isLoyaltyRoute = this.router.url === '/new-loyalty';
    });
  }
  addNewLoyaltyProgram() {
    this.router.navigate(['/new-loyalty']);
  }
}
