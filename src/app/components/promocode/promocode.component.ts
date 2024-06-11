import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promocode',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './promocode.component.html',
  styleUrl: './promocode.component.css'
})
export class PromocodeComponent {

  authService = inject(AuthService);
  programId: string = '';
  levelId: string = '';

  type: string = '';
  valueFactor: number = 0;

  router = inject(Router);
  fb = inject(FormBuilder);

  promoForm = this.fb.group({
    type: new FormControl(this.type, [Validators.required]),
    valueFactor: new FormControl(this.valueFactor, [Validators.required])
  });

  ngOnInit() {
    this.programId = this.authService.getCurrentProgramId() as string;
    this.levelId = this.authService.getCurrentLevelId() as string;
    
  }

  addPromoCode() {
    if (this.promoForm.valid) {
      const promoCode = {
        type: this.promoForm.get('type')?.value as string,
        valueFactor: this.promoForm.get('valueFactor')?.value as number
      };
      console.log(this.programId);
      console.log(this.levelId);
      this.authService.addPromoCode(this.programId, this.levelId, promoCode).subscribe(
        response => {
          console.log('Promo code added successfully', response);
          alert(`New promocode has been added succesfully!`);
          this.router.navigate(['/']);
        },
        error => {
          console.error('Error adding promo code', error);
        }
      );
    }
  }
}
