import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { IMessageGroup } from "../../features/chat/model/message";

@Injectable({
    providedIn: "root"
})
export class MessageShareService {
  private replyMessageSubject = new Subject<IMessageGroup>()
  replyMessage$ = this.replyMessageSubject.asObservable()

  sendReplyMessage(message: IMessageGroup) {
    this.replyMessageSubject.next(message)
  }
}