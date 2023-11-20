import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BeautySelectorAddonComponent} from './beauty-selector-addon.component';

describe('BeautySelectorAddonComponent', () => {
  let component: BeautySelectorAddonComponent;
  let fixture: ComponentFixture<BeautySelectorAddonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeautySelectorAddonComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BeautySelectorAddonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
