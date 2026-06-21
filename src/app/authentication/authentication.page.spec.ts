import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { authenticationPage } from './authentication.page';

describe('authenticationPage', () => {
  let component: authenticationPage;
  let fixture: ComponentFixture<authenticationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [authenticationPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(authenticationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
