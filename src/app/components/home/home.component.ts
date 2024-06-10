import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { LoyaltyProgram } from '../../entity/loyalty-program';
import { CommonModule } from '@angular/common';
import { LoyaltyLevel } from '../../entity/loyalty-level';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  authService = inject(AuthService);
  router = inject(Router);
  user?: any;
  programs: LoyaltyProgram[] = [];
  programName: string = '';
  levels: LoyaltyLevel[] = [];
  totalLoyaltyPrograms: number = 0;
  totalLoyaltyLevels: number = 0;
  chosenLevel: boolean = false;
  index: number = 0;
  


  constructor() {
    
  }

  ngOnInit() {
    this.authService.getLoyaltyPrograms().subscribe(
      (programs: LoyaltyProgram[]) => {
        console.log('Received programs:', programs);
        console.log('Type of programs:', typeof programs);
        this.programs = programs;
        console.log(this.programs);
        this.totalLoyaltyPrograms = programs.length;
        console.log(`Total loyalty programs: ${this.totalLoyaltyPrograms}`);
        //console.log(`Loyalty level: ${this.programs[0].loyalty_levels[0].name}`)
      },
      error => {
        console.error('Error fetching loyalty programs:', error);
      }
    );
  }

  handleLevels(index: number) {
    this.index = index;
    this.levels = this.programs[index].loyalty_levels;
    this.programName = this.programs[index].name;
    this.totalLoyaltyLevels = 0;
    this.chosenLevel = true;
  }

  back() {
    this.levels = [];
    this.programName = '';
    this.totalLoyaltyLevels = 0;
    this.chosenLevel = false;
  }

  newLevel() {
    const program = this.programs[this.index];
    this.authService.storeProgramId(program.id);
    this.router.navigate(['/new-level']);
  }

  handleDeleteLevel(index: number) {
    
  }

  logout() {
    this.authService.logout();
  }
}
