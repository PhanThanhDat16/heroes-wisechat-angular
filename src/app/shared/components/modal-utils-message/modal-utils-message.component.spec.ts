import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUtilsMessageComponent } from './modal-utils-message.component';

describe('ModalUtilsMessageComponent', () => {
  let component: ModalUtilsMessageComponent;
  let fixture: ComponentFixture<ModalUtilsMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalUtilsMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalUtilsMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
