import {
  Component,
  EventEmitter,
  inject,
  Output,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-add-chat',
  templateUrl: './modal-add-chat.component.html',
  styleUrl: './modal-add-chat.component.scss',
})
export class ModalAddChatComponent {
  @Output() stepEmitter = new EventEmitter<'CHOOSE_MEMBER' | 'CREATE_MEMBER'>();

  private modalService = inject(NgbModal);

  closeResult: WritableSignal<string> = signal('');

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (result) => {
          this.closeResult.set(`Closed with: ${result}`);
        },
        (reason) => {
          this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
        }
      );

    this.stepEmitter.emit('CHOOSE_MEMBER');
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
}
