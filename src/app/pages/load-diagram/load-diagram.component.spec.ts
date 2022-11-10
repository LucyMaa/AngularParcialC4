import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDiagramComponent } from './load-diagram.component';

describe('LoadDiagramComponent', () => {
  let component: LoadDiagramComponent;
  let fixture: ComponentFixture<LoadDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadDiagramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
