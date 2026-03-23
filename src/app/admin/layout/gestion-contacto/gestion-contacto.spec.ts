import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionContacto } from './gestion-contacto';

describe('GestionContacto', () => {
  let component: GestionContacto;
  let fixture: ComponentFixture<GestionContacto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionContacto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionContacto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
