import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddChatComponent } from './modal-add-chat.component';

describe('ModalAddChatComponent', () => {
  let component: ModalAddChatComponent;
  let fixture: ComponentFixture<ModalAddChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalAddChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalAddChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
