import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { DropdownlableComponent } from '../dropdownlable/dropdownlable.component';
import { ToastService } from 'angular-toastify';
import { ITag } from '../../../tags/model/tag';
import { HeroService } from '../../service/heroes.service';
import { loadHeroes } from '../../../../core/store/hero/hero.actions';
import { selectAllHeroes } from '../../../../core/store/hero/hero.selectors';
import { TagService } from '../../../tags/service/tag.service';
import { IHero } from '../../model/heroes';

@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrl: './heroes-list.component.scss',
})
export class HeroesListComponent implements OnInit, OnDestroy {
  heroes: IHero[] = [];
  trackSub: Subscription;
  selectedHeroIds: string[] = [];
  selectAll = false;
  tags: ITag[];
  isLoading = false;
  @ViewChild('dropdownComponent') dropdownComponent: DropdownlableComponent;

  constructor(
    private heroService: HeroService,
    private tagService: TagService,
    private store: Store,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadHeroes());
    this.trackSub = this.store.select(selectAllHeroes).subscribe({
      next: (data) => {
        this.isLoading = data.loading;
        this.heroes = data.heroes;
      },
    });

    const userId = localStorage.getItem('userId');
    if (userId) {
      this.tagService.getTagsByUser(userId).subscribe({
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

  // handleAddTagsToSelectedHeroes(tags: ITag[]) {
  //   if (this.selectedHeroIds.length === 0 || tags.length === 0) return;

  //   const userId = localStorage.getItem('userId');
  //   if (!userId) return;

  //   const result = tags.map((tag) => tag._id);

  //   this.tagService
  //     .addTagsToMultipleHeroes(this.selectedHeroIds, userId, result as string[])
  //     .subscribe({
  //       next: () => {
  //         this.store.dispatch(loadHeroes());
  //       },
  //       error: (error) => {
  //         console.error(error);
  //       },
  //     });
  // }

  handleAddTagsToSelectedHeroes(tags: ITag[]) {
    if (this.selectedHeroIds.length === 0 || tags.length === 0) return;

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    forkJoin(
      this.selectedHeroIds.map((id) =>
        this.heroService.getHeroDetailService(id)
      )
    ).subscribe((heroes: IHero[]) => {
      const tagIdsToAdd = tags.map((tag) => tag._id);

      const updateRequests = heroes.map((hero) => {
        const currentTagIds = (hero.tags || []).map((tag) => tag._id);

        const newTagIds = Array.from(
          new Set([...currentTagIds, ...tagIdsToAdd])
        );

        return this.tagService.addTagsToMultipleHeroes(
          [hero._id as string],
          userId,
          newTagIds as string[]
        );
      });

      forkJoin(updateRequests).subscribe({
        next: () => this.store.dispatch(loadHeroes()),
        error: (error) => console.error(error),
      });
    });
  }

  handleRemoveAllTag() {
    const userId = localStorage.getItem('userId');
    if (
      this.selectedHeroIds.length === 0 ||
      this.tags.length === 0 ||
      !userId
    ) {
      return;
    }

    // const tagsToRemove =
    //   this.dropdownComponent.selectedTags.length !== 0
    //     ? this.dropdownComponent.selectedTags
    //     : this.dropdownComponent.allSelectedTags;

    const resultCommon = [
      ...this.dropdownComponent.selectedTags,
      ...this.dropdownComponent.allSelectedTags,
    ];
    const seen = new Set();
    const tagsToRemove = resultCommon.filter((item) => {
      const id = item._id;
      if (seen.has(id)) {
        return false;
      }
      seen.add(id);
      return true;
    });

    const result = tagsToRemove.map((tag) => tag._id);

    this.tagService
      .deleteTagsToMultipleHeroes(
        this.selectedHeroIds,
        userId,
        result as string[]
      )
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
