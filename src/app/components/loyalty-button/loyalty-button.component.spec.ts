import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyButtonComponent } from './loyalty-button.component';

describe('LoyaltyButtonComponent', () => {
  let component: LoyaltyButtonComponent;
  let fixture: ComponentFixture<LoyaltyButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoyaltyButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoyaltyButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
