import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileInforComponent } from './profile-infor.component';

describe('ProfileInforComponent', () => {
  let component: ProfileInforComponent;
  let fixture: ComponentFixture<ProfileInforComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileInforComponent],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
