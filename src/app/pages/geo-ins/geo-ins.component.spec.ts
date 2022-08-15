import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoInsComponent } from './geo-ins.component';

describe('GeoInsComponent', () => {
  let component: GeoInsComponent;
  let fixture: ComponentFixture<GeoInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoInsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
