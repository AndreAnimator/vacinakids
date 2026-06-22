import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ChildVaccinesPage } from './child-vaccines.page';

describe('ChildVaccinesPage', () => {
  let component: ChildVaccinesPage;
  let fixture: ComponentFixture<ChildVaccinesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChildVaccinesPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ChildVaccinesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
