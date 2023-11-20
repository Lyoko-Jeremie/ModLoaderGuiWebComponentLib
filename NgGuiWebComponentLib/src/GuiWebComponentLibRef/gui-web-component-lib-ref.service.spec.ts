import {TestBed} from '@angular/core/testing';

import {GuiWebComponentLibRefService} from './gui-web-component-lib-ref.service';

describe('GuiWebComponentLibRefService', () => {
  let service: GuiWebComponentLibRefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuiWebComponentLibRefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
