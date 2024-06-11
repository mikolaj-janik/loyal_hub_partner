import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-level',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-level.component.html',
  styleUrl: './edit-level.component.css'
})
export class EditLevelComponent {
  loyaltyProgramId: string = '';
  loyaltyLevelUuid: string = '';

  loyaltyLevelName: string = '';
  valueFactor: number = 0;

  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  levelForm = this.fb.group({
    loyaltyLevelName: new FormControl(this.loyaltyLevelName, [Validators.required]),
    valueFactor: new FormControl(this.valueFactor, [Validators.required])
  });

  ngOnInit() {
    this.loyaltyProgramId = this.authService.getCurrentProgramId() as string;
    this.loyaltyLevelUuid = this.authService.getCurrentLevelId() as string;
    this.loyaltyLevelName = this.authService.getCurrentLevelName() as string;
    this.valueFactor = Number(this.authService.getCurrentLevelValue());

    console.log(this.loyaltyLevelUuid);
    console.log(this.loyaltyLevelName);
    console.log(this.valueFactor);

    this.levelForm.patchValue({
      loyaltyLevelName: this.loyaltyLevelName,
      valueFactor: this.valueFactor
    });
  }

  saveChanges() {
    if (this.levelForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }

    const updatedLevel = {
      loyaltyLevelName: this.levelForm.get('loyaltyLevelName')?.value as string,
      valueFactor: this.levelForm.get('valueFactor')?.value as number
    };

    this.authService.updateLoyaltyLevel(this.loyaltyProgramId, this.loyaltyLevelUuid, updatedLevel)
      .subscribe(
        () => {
          alert('Loyalty level has been updated successfully!');
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error updating loyalty level:', error);
          alert('An error occurred while updating the loyalty level.');
        }
      );
  }
}
