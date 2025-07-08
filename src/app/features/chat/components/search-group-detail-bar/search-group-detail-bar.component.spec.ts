import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchGroupDetailBarComponent } from './search-group-detail-bar.component';

describe('SearchGroupDetailBarComponent', () => {
  let component: SearchGroupDetailBarComponent;
  let fixture: ComponentFixture<SearchGroupDetailBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchGroupDetailBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchGroupDetailBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
