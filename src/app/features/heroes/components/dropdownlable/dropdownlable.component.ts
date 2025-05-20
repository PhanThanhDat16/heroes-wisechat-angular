import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { Store } from '@ngrx/store';
import { colorPalette } from '../../../../constant/color-palette.constant';
import { HeroService } from '../../../../api/heroes.service';
import { loadHeroes } from '../../../../store/hero/hero.actions';
import { IHero } from '../../../../types/heroes';

@Component({
  selector: 'app-dropdownlable',
  templateUrl: './dropdownlable.component.html',
  styleUrl: './dropdownlable.component.scss',
})
export class DropdownlableComponent implements OnChanges {
  selectedTags: string[] = [];
  allSelectedTags: string[] = [];
  allTags: string[] = [];
  @Input() tags: string[];
  @Input() selectedHeroIds: string[];
  @Input() heroSelectLengt: number;
  @Output() tagsSelected = new EventEmitter<string[]>();

  colorPalette = colorPalette;

  constructor(private heroSerivce: HeroService, private store: Store) {}

  handleAddTag(tag: string) {
    const userId = localStorage.getItem('userId');
    if (!this.selectedTags.includes(tag) && userId) {
      this.selectedTags.push(tag);
      this.tags = this.tags.filter((t) => t !== tag);
      this.tagsSelected.emit(this.selectedTags);
    }
  }

  handleDeleteTag(tag: string) {
    const userId = localStorage.getItem('userId');
    if (!userId || this.selectedHeroIds.length === 0) return;
    this.heroSerivce
      .deleteTagsToMultipleHeroes(this.selectedHeroIds, userId, [tag])
      .subscribe({
        next: () => {
          this.selectedTags = this.selectedTags.filter((t) => t !== tag);
          this.tags.unshift(tag);
          this.tagsSelected.emit(this.selectedTags);
          this.store.dispatch(loadHeroes());
        },
        error: (error) => console.log(error),
      });
  }

  ngOnChanges(): void {
    if (this.allTags.length === 0 && this.tags.length > 0) {
      this.allTags = [...this.tags];
    }

    const userId = localStorage.getItem('userId');
    if (this.selectedHeroIds.length > 0 && userId) {
      const heroRequests = this.selectedHeroIds.map((id) =>
        this.heroSerivce.getHeroDetailService(id)
      );

      forkJoin(heroRequests).subscribe((heroes: IHero[]) => {
        const tagsArray = heroes.map((h) => h.tags || []);

        const allTagsSet = new Set<string>();
        tagsArray.forEach((tags) => tags.forEach((tag) => allTagsSet.add(tag)));
        this.allSelectedTags = Array.from(allTagsSet);
        let commonTags: string[] = tagsArray[0];
        for (let i = 1; i < tagsArray.length; i++) {
          commonTags = commonTags.filter((tag) => tagsArray[i].includes(tag));
        }
        this.selectedTags = commonTags;
        this.tags = this.allTags.filter((tag) => !commonTags.includes(tag));
      });
    } else {
      this.selectedTags = [];
      this.tags = [...this.allTags];
    }
  }
}
