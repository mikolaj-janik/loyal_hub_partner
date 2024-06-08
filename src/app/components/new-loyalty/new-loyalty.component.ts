import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-loyalty',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-loyalty.component.html',
  styleUrl: './new-loyalty.component.css'
})
export class NewLoyaltyComponent {
  name: string = '';
  authService = inject(AuthService);
  router = inject(Router);

  loyaltyForm = new FormGroup({
    name: new FormControl(this.name, [Validators.required, Validators.minLength(3)]),
  });

  addNewLoyaltyProgram() {
    const { name } = this.loyaltyForm.value;
    const program = { loyaltyProgramName: name as string };
    this.authService.addLoyaltyProgram(program).subscribe({
      next: response => {
        console.log('Program added successfully', response);
        this.router.navigate(['/']);
        alert("New loyalty program added succesfully.");
      },
      error: error => {
        console.error('Error adding program', error);
      }
    });
  }
}
