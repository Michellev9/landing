import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPadres } from './gestion-padres';

describe('GestionPadres', () => {
  let component: GestionPadres;
  let fixture: ComponentFixture<GestionPadres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPadres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPadres);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
