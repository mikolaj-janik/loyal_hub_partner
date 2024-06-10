import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-level',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-new-level.component.html',
  styleUrl: './add-new-level.component.css'
})
export class AddNewLevelComponent {

  loyaltyProgramId: string = '';

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
    console.log(this.loyaltyProgramId);
  }

  addNewLevel() {
    if (this.levelForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }

    const newLevel = {
      loyaltyLevelName: this.levelForm.get('loyaltyLevelName')?.value as string,
      valueFactor: this.levelForm.get('valueFactor')?.value as number
    };

    this.authService.addLoyaltyLevel(this.loyaltyProgramId, newLevel)
      .subscribe(
        () => {
          alert('New level has been added!');
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error adding new level:', error);
          alert('An error occurred while adding the new level.');
        }
      );
  }
}
