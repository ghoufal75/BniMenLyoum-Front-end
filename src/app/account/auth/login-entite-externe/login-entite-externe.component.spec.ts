import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginEntiteExterneComponent } from './login-entite-externe.component';

describe('LoginEntiteExterneComponent', () => {
  let component: LoginEntiteExterneComponent;
  let fixture: ComponentFixture<LoginEntiteExterneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginEntiteExterneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginEntiteExterneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
