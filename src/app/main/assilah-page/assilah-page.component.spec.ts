import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssilahPageComponent } from './assilah-page.component';

describe('AssilahPageComponent', () => {
  let component: AssilahPageComponent;
  let fixture: ComponentFixture<AssilahPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssilahPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssilahPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
