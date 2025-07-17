import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { ITag } from '../../../tags/model/tag';
import { HeroServiceAPI } from '../../service/heroesAPI.service';
import { TagService } from '../../../tags/service/tag.service';
import { IHero } from '../../model/heroes';
import { HeroService } from '../../service/hero.service';

@Component({
  selector: 'app-dropdownlable',
  templateUrl: './dropdownlable.component.html',
  styleUrl: './dropdownlable.component.scss',
})
export class DropdownlableComponent implements OnChanges {
  selectedTags: ITag[] = [];
  allSelectedTags: ITag[] = [];
  allTags: ITag[] = [];
  @Input() tags: ITag[];
  @Input() selectedHeroIds: string[];
  @Input() heroSelectLengt: number;
  @Output() tagsSelected = new EventEmitter<ITag[]>();
  availableTags: ITag[] = [];

  constructor(
    private heroSerivceAPI: HeroServiceAPI,
    private tagService: TagService,
    private heroService: HeroService
  ) {}

  handleAddTag(tag: ITag) {
    const userId = localStorage.getItem('userId');
    if (!this.selectedTags.includes(tag) && userId) {
      this.selectedTags.push(tag);
      this.tags = this.tags.filter((t) => t._id !== tag._id);
      this.tagsSelected.emit(this.selectedTags);
    }
  }

  handleDeleteTag(tag: ITag) {
    const userId = localStorage.getItem('userId');
    if (!userId || this.selectedHeroIds.length === 0) return;
    this.tagService
      .deleteTagsToMultipleHeroes(this.selectedHeroIds, userId, [
        tag._id as string,
      ])
      .subscribe({
        next: () => {
          this.selectedTags = this.selectedTags.filter(
            (t) => t._id !== tag._id
          );
          this.tags.unshift(tag);
          this.tagsSelected.emit(this.selectedTags);
          this.heroService.loadHero();
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
        this.heroSerivceAPI.getHeroDetailService(id)
      );

      forkJoin(heroRequests).subscribe((heroes: IHero[]) => {
        const tagsArray: ITag[][] = heroes.map((h) =>
          (h.tags || []).filter(
            (tag) => typeof tag === 'object' && tag !== null
          )
        );
        const tagMap = new Map<string, ITag>();
        tagsArray.forEach((tags) => {
          tags.forEach((tag) => {
            if (tag._id && !tagMap.has(tag._id)) {
              tagMap.set(tag._id, tag);
            }
          });
        });
        this.allSelectedTags = Array.from(tagMap.values());

        let commonTags = tagsArray[0];
        for (let i = 1; i < tagsArray.length; i++) {
          const tagIds = new Set(tagsArray[i].map((t) => t._id));
          commonTags = commonTags.filter(
            (tag) => tag._id && tagIds.has(tag._id)
          );
        }

        this.selectedTags = commonTags;
        const commonTagIds = new Set(commonTags.map((t) => t._id));
        this.tags = this.allTags.filter((tag) => !commonTagIds.has(tag._id));
      });
    } else {
      this.selectedTags = [];
      this.tags = [...this.allTags];
    }
  }
}
