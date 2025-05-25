import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeometryBoxComponent } from './geometry-box.component';

describe('GeometryBoxComponent', () => {
  let component: GeometryBoxComponent;
  let fixture: ComponentFixture<GeometryBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeometryBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeometryBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
