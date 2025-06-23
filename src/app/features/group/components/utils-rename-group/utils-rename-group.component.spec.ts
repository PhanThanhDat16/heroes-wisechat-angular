import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilsRenameGroupComponent } from './utils-rename-group.component';

describe('UtilsRenameGroupComponent', () => {
  let component: UtilsRenameGroupComponent;
  let fixture: ComponentFixture<UtilsRenameGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UtilsRenameGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UtilsRenameGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
