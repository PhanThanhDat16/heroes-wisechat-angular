import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUtilsChatComponent } from './modal-utils-chat.component';

describe('ModalUtilsChatComponent', () => {
  let component: ModalUtilsChatComponent;
  let fixture: ComponentFixture<ModalUtilsChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalUtilsChatComponent],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalUtilsChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
