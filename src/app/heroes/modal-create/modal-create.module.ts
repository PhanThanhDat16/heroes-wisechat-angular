import { NgModule } from "@angular/core"; 
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { ModalCreateComponent } from "./modal-create.component";
// import { CreateModule } from "../create/create.module";
import { SharedPipeModule } from "../../pipes/sharedPipe.module";
import { ReactiveFormsModule } from "@angular/forms";
import { CreateComponent } from "../create/create.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [ModalCreateComponent, CreateComponent],
    imports: [NgbDatepickerModule, SharedPipeModule, ReactiveFormsModule, CommonModule],
    exports: [ModalCreateComponent, CreateComponent]
})
export class ModalCreateModule{}