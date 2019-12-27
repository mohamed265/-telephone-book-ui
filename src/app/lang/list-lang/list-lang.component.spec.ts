import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLangComponent } from './list-lang.component';

describe('ListLangComponent', () => {
  let component: ListLangComponent;
  let fixture: ComponentFixture<ListLangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
