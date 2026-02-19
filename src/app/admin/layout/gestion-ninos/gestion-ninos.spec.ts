import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionNinos } from './gestion-ninos';

describe('GestionNinos', () => {
  let component: GestionNinos;
  let fixture: ComponentFixture<GestionNinos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionNinos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionNinos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
