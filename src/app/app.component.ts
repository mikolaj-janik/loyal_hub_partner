import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './service/auth.service';
import { LogoutButtonComponent } from "./components/logout-button/logout-button.component";
import { LoyaltyButtonComponent } from "./components/loyalty-button/loyalty-button.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, LogoutButtonComponent, LoyaltyButtonComponent]
})
export class AppComponent {
  
}
