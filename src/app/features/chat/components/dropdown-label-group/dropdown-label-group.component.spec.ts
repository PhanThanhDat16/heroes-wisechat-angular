import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownLabelGroupComponent } from './dropdown-label-group.component';

describe('DropdownLabelGroupComponent', () => {
  let component: DropdownLabelGroupComponent;
  let fixture: ComponentFixture<DropdownLabelGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownLabelGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropdownLabelGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
