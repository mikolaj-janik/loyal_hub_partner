import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLoyaltyComponent } from './new-loyalty.component';

describe('NewLoyaltyComponent', () => {
  let component: NewLoyaltyComponent;
  let fixture: ComponentFixture<NewLoyaltyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLoyaltyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewLoyaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
