import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoyaltyProgram } from '../../entity/loyalty-program';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invitation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.css']
})
export class InvitationComponent implements OnInit {
  programs: LoyaltyProgram[] = [];

  authService: AuthService;
  clientEmail = '';
  invitationForm!: FormGroup;
  router = inject(Router);

  constructor(private fb: FormBuilder, authService: AuthService) {
    this.authService = authService;
  }

  ngOnInit() {
    this.invitationForm = this.fb.group({
      programId: ['', [Validators.required]],
      clientEmail: ['', [Validators.required, Validators.email, Validators.minLength(3)]]
    });
    this.authService.getLoyaltyPrograms().subscribe(
      (programs: LoyaltyProgram[]) => {
        console.log('Received programs:', programs);
        console.log('Type of programs:', typeof programs);
        this.programs = programs;
        console.log(this.programs);
      },
      error => {
        console.error('Error fetching loyalty programs:', error);
      }
    );
    
  }

  inviteClient() {
    if (this.invitationForm.valid) {
      const formValue = this.invitationForm.value;
      this.authService.sendInvitation(formValue.programId, formValue.clientEmail)
        .subscribe(
          response => {
            console.log('Invitation sent successfully:', response);
          },
          error => {
            console.error('Error sending invitation:', error);
          }
        );
        this.router.navigate(['/']);
    }
  }
}


