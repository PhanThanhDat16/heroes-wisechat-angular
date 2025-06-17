import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilsFindMessageGroupComponent } from './utils-find-message-group.component';

describe('UtilsFindMessageGroupComponent', () => {
  let component: UtilsFindMessageGroupComponent;
  let fixture: ComponentFixture<UtilsFindMessageGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UtilsFindMessageGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UtilsFindMessageGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
