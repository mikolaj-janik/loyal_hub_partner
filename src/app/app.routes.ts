import { Routes } from '@angular/router';
import { authGuard, authGuardEmail } from './auth.guard';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NewLoyaltyComponent } from './components/new-loyalty/new-loyalty.component';
import { InvitationComponent } from './components/invitation/invitation.component';
import { AddNewLevelComponent } from './components/add-new-level/add-new-level.component';
import { EditLevelComponent } from './components/edit-level/edit-level.component';

export const routes: Routes = [
    {path: '', component: HomeComponent, canActivate: [authGuard]},
    {path: 'new-loyalty', component: NewLoyaltyComponent, canActivate: [authGuard]},
    {path: 'invitations', component: InvitationComponent, canActivate: [authGuard]},
    {path: 'new-level', component: AddNewLevelComponent, canActivate: [authGuard]},
    {path: 'edit-level', component: EditLevelComponent, canActivate: [authGuard]},
    {path: 'login', component: LoginComponent },
    {path: 'register', component: RegisterComponent },
];
