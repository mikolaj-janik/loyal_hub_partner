import { Component, inject, OnInit, NgModule } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-invitation-button',
  standalone: true,
  imports: [],
  templateUrl: './invitation-button.component.html',
  styleUrl: './invitation-button.component.css'
})
export class InvitationButtonComponent {
  authService = inject(AuthService);
  router = inject(Router);
  isLoggedIn! : boolean;
  isInvitationRoute: boolean = false;
  name = '';


  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isInvitationRoute = this.router.url === '/invitations';
    });
    
  }

  inviteClient() {
    this.router.navigate(['/invitations']);
  }
}

