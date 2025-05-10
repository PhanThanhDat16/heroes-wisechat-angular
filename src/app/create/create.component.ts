import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  formCreate = new FormGroup({
    name: new FormControl('', Validators.required),
    mail: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9]+\.[a-z]{2,4}$/),
      ])
    ),
    age: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    gender: new FormControl('male', Validators.required),
  });

  handleSubmit() {
    if (this.formCreate.invalid) return;
    console.log(this.formCreate.value);
  }
}
