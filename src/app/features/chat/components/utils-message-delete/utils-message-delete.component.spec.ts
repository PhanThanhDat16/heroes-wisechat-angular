import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilsMessageDeleteComponent } from './utils-message-delete.component';

describe('UtilsMessageDeleteComponent', () => {
  let component: UtilsMessageDeleteComponent;
  let fixture: ComponentFixture<UtilsMessageDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UtilsMessageDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UtilsMessageDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
