import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-beauty-selector-addon',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  templateUrl: './beauty-selector-addon.component.html',
  styleUrl: './beauty-selector-addon.component.scss',
})
export class BeautySelectorAddonComponent {
  _show: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Input()
  set show(v: boolean) {
    this._show.next(v);
  }

  get show(): boolean {
    return this._show.getValue();
  }

  @Output() showChange = this._show.asObservable();

}

