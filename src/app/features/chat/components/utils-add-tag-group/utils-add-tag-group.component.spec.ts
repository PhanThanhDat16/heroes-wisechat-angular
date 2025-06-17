import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilsAddTagGroupComponent } from './utils-add-tag-group.component';

describe('UtilsAddTagGroupComponent', () => {
  let component: UtilsAddTagGroupComponent;
  let fixture: ComponentFixture<UtilsAddTagGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UtilsAddTagGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UtilsAddTagGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
