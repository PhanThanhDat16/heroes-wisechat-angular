import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { IHero } from '../../types/heroes';
import { HeroService } from '../../service/heroes.service';
import { loadHeroes } from '../../store/hero/hero.actions';
import { selectAllHeroes } from '../../store/hero/hero.selectors';
import { UserService } from '../../service/user.service';
import { DropdownlableComponent } from '../dropdownlable/dropdownlable.component';
import { ToastService } from 'angular-toastify';

@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrl: './heroes-list.component.scss',
})
export class HeroesListComponent implements OnInit, OnDestroy {
  heroes: IHero[] = [];
  trackSub: Subscription;
  selectedHeroIds: string[] = [];
  selectAll: boolean = false;
  tags: string[];
  isLoading: boolean = false
  @ViewChild('dropdownComponent') dropdownComponent: DropdownlableComponent;

  constructor(
    private heroService: HeroService,
    private userService: UserService,
    private store: Store,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadHeroes());
    this.trackSub = this.store.select(selectAllHeroes).subscribe({
      next: (data) => {
        // console.log(data)
        this.isLoading = data.loading
        this.heroes = data.heroes
      },
    });

    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getTagsByUser(userId).subscribe({
        next: (data) => (this.tags = data),
      });
    }
  }

  toggleSelectAll(event: any) {
    this.selectAll = event.target.checked;
    if (event.target.checked) {
      this.selectedHeroIds = this.heroes.map((h) => h._id!);
    } else {
      this.selectedHeroIds = [];
    }
  }

  handleSelectHero(heroId: string, checked: boolean) {
    if (checked) {
      this.selectedHeroIds.push(heroId);
    } else {
      this.selectedHeroIds = this.selectedHeroIds.filter((id) => id !== heroId);
    }
    this.selectAll = this.selectedHeroIds.length === this.heroes.length;
  }

  handleDeleteSelected() {
    if (this.selectedHeroIds.length === 0) return;
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
        this.heroService
          .deleteManyHeroesService(this.selectedHeroIds)
          .subscribe({
            next: (data) => {
              console.log(data);
              this.heroes = this.heroes.filter(
                (h) => !this.selectedHeroIds.includes(h._id!)
              );
              this.selectedHeroIds = [];
              this.selectAll = false;
              Swal.fire({
                title: 'Delete Successfully',
                icon: 'success',
              });
            },
            error: (error) => console.log(error),
          });
      }
    });
  }

  handleAddTagsToSelectedHeroes(tags: string[]) {
    if (this.selectedHeroIds.length === 0 || tags.length === 0) return;

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.heroService
      .addTagsToMultipleHeroes(this.selectedHeroIds, userId, tags)
      .subscribe({
        next: () => {
          this.store.dispatch(loadHeroes());
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  handleRemoveAllTag() {
    const userId = localStorage.getItem('userId');
    if (this.selectedHeroIds.length === 0 || this.tags.length === 0 || !userId)
      return;

    const tagsToRemove = this.dropdownComponent.allSelectedTags ?? [];
    console.log(tagsToRemove)
    this.heroService
      .deleteTagsToMultipleHeroes(this.selectedHeroIds, userId, tagsToRemove)
      .subscribe({
        next: () => {
          this.selectedHeroIds = [];
          this.store.dispatch(loadHeroes());
          this.toastService.success('Remove All Succesfull');
        },
        error: (error) => {
          this.toastService.error('Remove All Failed');
        },
      });
  }

  ngOnDestroy(): void {
    this.trackSub.unsubscribe();
  }
}
