import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownlableComponent } from './dropdownlable.component';

describe('DropdownlableComponent', () => {
  let component: DropdownlableComponent;
  let fixture: ComponentFixture<DropdownlableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownlableComponent],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropdownlableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
