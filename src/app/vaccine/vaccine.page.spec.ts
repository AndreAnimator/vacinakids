import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { VaccinePage } from './vaccine.page';

describe('VaccinePage', () => {
  let component: VaccinePage;
  let fixture: ComponentFixture<VaccinePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VaccinePage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(VaccinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
