import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoColComponent } from './geo-col.component';

describe('GeoColComponent', () => {
  let component: GeoColComponent;
  let fixture: ComponentFixture<GeoColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoColComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
