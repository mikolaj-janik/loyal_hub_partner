import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationButtonComponent } from './invitation-button.component';

describe('InvitationButtonComponent', () => {
  let component: InvitationButtonComponent;
  let fixture: ComponentFixture<InvitationButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvitationButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
