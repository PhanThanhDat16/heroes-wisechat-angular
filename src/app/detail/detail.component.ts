import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IHero } from '../types/heroes';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { test } from '../list-hero';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  id: number = 0;
  heroes: IHero[] = test;
  formDetail = new FormGroup({
    name: new FormControl('', Validators.required),
    gender: new FormControl('male'),
    mail: new FormControl(
      '',
      Validators.compose([Validators.email, Validators.required])
    ),
    age: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
  });

  constructor(private route: ActivatedRoute) {
    this.id = Number(this.route.snapshot.params['id']);
  }

  ngOnInit(): void {
    this.formDetail.patchValue({
      name: this.heroes[this.id - 1].name,
      gender: this.heroes[this.id - 1].gender,
      mail: this.heroes[this.id - 1].mail,
      age: this.heroes[this.id - 1].age.toString(),
      address: this.heroes[this.id - 1].address,
    });
  }

  handleSubmit() {
    console.log(this.formDetail.value);
  }

  handleDelete(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'This is a SweetAlert2 alert.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if(result.isConfirmed){
        Swal.fire({
          title: "Delete Successfully",
          icon: "success",
        })
      }
    })
  }
}
