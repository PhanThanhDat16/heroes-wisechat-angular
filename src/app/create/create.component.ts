import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HeroService } from '../service/heroes.service';
import { IHeroUpdate } from '../types/heroes';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { createHero } from '../store/hero/hero.actions';
import { Store } from '@ngrx/store';
import { selectHeroError } from '../store/hero/hero.selectors';
import { ToastService } from 'angular-toastify';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  @Input() modalRef: NgbActiveModal;

  isLoading = false;
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

  constructor(
    private heroService: HeroService,
    private store: Store,
    private toastService: ToastService
  ) {}

  handleSubmit() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.isLoading = true;

      const heroUpdate: IHeroUpdate = {
        name: this.formCreate.value.name || '',
        gender: this.formCreate.value.gender || 'male',
        mail: this.formCreate.value.mail || '',
        age: Number(this.formCreate.value.age) || 0,
        address: this.formCreate.value.address || '',
        userId,
      };

      try {
        this.store.dispatch(createHero({ hero: heroUpdate }));
        this.modalRef.close();
        // this.heroService.createHeroService(heroUpdate).subscribe({
        //   next: (data) => {
        //     this.modalRef.close();
        //   },
        // });
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
