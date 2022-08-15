import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginResponsableComponent } from './login-responsable.component';

describe('LoginResponsableComponent', () => {
  let component: LoginResponsableComponent;
  let fixture: ComponentFixture<LoginResponsableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginResponsableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
