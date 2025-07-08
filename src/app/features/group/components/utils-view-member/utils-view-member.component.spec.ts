import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilsViewMemberComponent } from './utils-view-member.component';

describe('UtilsViewMemberComponent', () => {
  let component: UtilsViewMemberComponent;
  let fixture: ComponentFixture<UtilsViewMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UtilsViewMemberComponent],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UtilsViewMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
