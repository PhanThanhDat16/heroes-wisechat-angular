import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberGroupComponent } from './add-member-group.component';

describe('AddMemberGroupComponent', () => {
  let component: AddMemberGroupComponent;
  let fixture: ComponentFixture<AddMemberGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMemberGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddMemberGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
