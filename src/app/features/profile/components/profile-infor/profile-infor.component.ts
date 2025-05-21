import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { IUser } from '../../../../core/model/user';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-profile-infor',
  templateUrl: './profile-infor.component.html',
  styleUrl: './profile-infor.component.scss',
})
export class ProfileInforComponent implements OnInit {
  constructor(private userService: UserService, private toastService: ToastService) {}

  formProfile = new FormGroup({
    email: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9]+\.[a-z]{2,4}$/),
      ])
    ),
    username: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.userService.getProfile().subscribe()
    this.userService.user$.subscribe({
      next: (data) => {
        this.formProfile.patchValue({
          email: data.email,
          username: data.username,
        });
      },
    });
  }

  handleSubmit() {
    if(this.formProfile.invalid) return
    const userId = localStorage.getItem('userId')
    if(userId){
      this.userService.updateProfile(userId, this.formProfile.value as IUser).subscribe({
        next: (data) => {
          console.log(data)
          this.toastService.success('Update Successfully')
        },
        error: (error) => {
          this.toastService.error(error.error.message)
        }
      })
    }
  }
}
