import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IHero, IHeroUpdate } from '../types/heroes';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { HeroService } from '../service/heroes.service';
import { Store } from '@ngrx/store';
import { deleteHero, updateHero } from '../store/hero/hero.actions';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit, OnDestroy {
  id: string;
  hero: IHero;
  trackSub: Subscription;
  isLoading = false;
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
    private heroService: HeroService,
    private router: Router,
    private store: Store
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
      // this.heroService.updateHeroService(this.id, heroUpdate).subscribe({
      //   next: (data) => {
      //     this.toastService.success("Update Successfully")
      //   },
      // });
      this.store.dispatch(updateHero({ id: this.id, hero: heroUpdate }));
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
          // this.heroService.deleteHeroService(this.id).subscribe({
          //   next: () => {
          //     Swal.fire({
          //       title: 'Delete Successfully',
          //       icon: 'success',
          //     }).then(() => {
          //       this.router.navigate(['/']);
          //     });
          //   },
          // });
          this.store.dispatch(deleteHero({ id: this.id }));
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
    this.trackSub = this.heroService.getHeroDetailService(this.id).subscribe({
      next: (data) => {
        this.hero = data;
        this.formDetail.patchValue({
          name: this.hero.name,
          gender: this.hero.gender,
          mail: this.hero.mail,
          age: this.hero.age + '',
          address: this.hero.address,
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.trackSub.unsubscribe();
  }
}
