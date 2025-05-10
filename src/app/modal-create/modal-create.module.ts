import { NgModule } from "@angular/core"; 
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { ModalCreateComponent } from "./modal-create.component";
import { CreateModule } from "../create/create.module";

@NgModule({
    declarations: [ModalCreateComponent],
    imports: [NgbDatepickerModule, CreateModule],
    exports: [ModalCreateComponent]
})
export class ModalCreateModule{}