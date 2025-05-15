import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { IRegister } from '../types/user';
import { ToastService } from 'angular-toastify';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {

  constructor(private userService: UserService, private toastService: ToastService, private router: Router){}

  formRegister = new FormGroup({
    email: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        ,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9]+\.[a-z]{2,4}$/),
      ])
    ),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });



  handleSubmit(){
    if(this.formRegister.invalid) return
    this.userService.registerService(this.formRegister.value as IRegister).subscribe({
      next: (data) => {
        this.router.navigate(['/login'])
        this.toastService.success('Register successfully')
      },
      error: (error) => {
        this.toastService.error(error.error.message)
      }
    })
  }

  ngOnInit(): void {
      localStorage.clear()
  }
}
