import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDetailBarComponent } from './group-detail-bar.component';

describe('GroupDetailBarComponent', () => {
  let component: GroupDetailBarComponent;
  let fixture: ComponentFixture<GroupDetailBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupDetailBarComponent],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupDetailBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
