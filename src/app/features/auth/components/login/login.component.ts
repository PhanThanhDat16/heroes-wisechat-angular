import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { AuthService } from '../../../../core/services/auth.service';
import { IAuth } from '../../model/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  formLogin = new FormGroup({
    email: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9]+\.[a-z]{2,4}$/),
      ])
    ),
    password: new FormControl('', Validators.required),
  });

  handleSubmit() {
    if (this.formLogin.invalid) return;

    this.authService.loginService(this.formLogin.value as IAuth).subscribe({
      next: (data) => {
        localStorage.setItem('userId', data._id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        this.toastService.success('Login successfully');
          this.router.navigate(['/']);
      },
      error: (data) => {
        this.toastService.error(data.error.message);
      },
    });
  }

  ngOnInit(): void {
    localStorage.clear();
  }
}
