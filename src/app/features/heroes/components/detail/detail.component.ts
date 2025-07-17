import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { ITag } from '../../../tags/model/tag';
import { HeroServiceAPI } from '../../service/heroesAPI.service';
import { IHero, IHeroUpdate } from '../../model/heroes';
import { HeroService } from '../../service/hero.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit, OnDestroy {
  id: string;
  hero: IHero;
  trackSub: Subscription;
  checkUserId = true;
  isLoading = false;
  username = '';
  tags: ITag[] = [];
  createdAt = '';

  formDetail = new FormGroup({
    name: new FormControl('', Validators.required),
    gender: new FormControl('male'),
    mail: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9]+\.[a-z]{2,4}$/),
      ])
    ),
    age: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
  });

  constructor(
    private route: ActivatedRoute,
    private heroServiceAPI: HeroServiceAPI,
    private router: Router,
    private heroService: HeroService
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  handleSubmit() {
    this.isLoading = true;
    const heroUpdate: IHeroUpdate = {
      name: this.formDetail.value.name || '',
      gender: this.formDetail.value.gender || 'male',
      mail: this.formDetail.value.mail || '',
      age: Number(this.formDetail.value.age) || 0,
      address: this.formDetail.value.address || '',
    };

    try {
      this.heroService.updateHero(this.id, heroUpdate);
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  handleDelete() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          this.heroService.deleteHero(this.id);
          Swal.fire({
            title: 'Delete Successfully',
            icon: 'success',
          }).then(() => {
            this.router.navigate(['/']);
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.isLoading = true;
      this.trackSub = this.heroServiceAPI
        .getHeroDetailService(this.id)
        .subscribe({
          next: (data) => {
            this.createdAt = data.createdAt ?? '';
            this.checkUserId = data.userId === userId;
            this.hero = data;
            this.tags = this.hero.tags ?? [];
            this.formDetail.patchValue({
              name: this.hero.name,
              gender: this.hero.gender,
              mail: this.hero.mail,
              age: this.hero.age + '',
              address: this.hero.address,
            });
            this.isLoading = false;
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.trackSub.unsubscribe();
  }
}
