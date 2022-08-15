import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGeoportailComponent } from './user-geoportail.component';

describe('UserGeoportailComponent', () => {
  let component: UserGeoportailComponent;
  let fixture: ComponentFixture<UserGeoportailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGeoportailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGeoportailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
