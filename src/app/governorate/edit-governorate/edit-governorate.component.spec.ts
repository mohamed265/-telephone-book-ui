import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGovernorateComponent } from './edit-governorate.component';

describe('EditGovernorateComponent', () => {
  let component: EditGovernorateComponent;
  let fixture: ComponentFixture<EditGovernorateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGovernorateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGovernorateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
