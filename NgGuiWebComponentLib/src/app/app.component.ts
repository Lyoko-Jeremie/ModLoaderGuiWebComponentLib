import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SwalPortalTargets, SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {BeautySelectorAddonComponent} from "../beauty-selector-addon/beauty-selector-addon.component";
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {GuiWebComponentLibRefService} from "../GuiWebComponentLibRef/gui-web-component-lib-ref.service";
import {StringTable} from "../GUI_StringTable/StringTable";

@Component({
  selector: 'app-component',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    SweetAlert2Module,
    BeautySelectorAddonComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  StringTable = StringTable;
  // @Input() a: string = 'AppComponent';
  // @Input() b: number = 1;
  // @Input() active = false;
  // @Output() change = new EventEmitter<boolean>();
  // toggle(): void {
  //   this.active = !this.active;
  //   this.change.emit(this.active);
  // }

  private modalService = inject(NgbModal);
  closeResult = '';

  open(content: TemplateRef<any>) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      fullscreen: true,
      container: this.modalHostElement.nativeElement,
    }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: ModalDismissReasons | string): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  @ViewChild('modalHostElement')
  modalHostElement!: ElementRef;

  // @HostBinding('attr.data-bs-theme') dataBsTheme = 'dark';

  constructor(
    public swalTargets: SwalPortalTargets,
    public guiWclRef: GuiWebComponentLibRefService,
  ) {
  }

  debug(e: any) {
    console.log(e);
  }
}
