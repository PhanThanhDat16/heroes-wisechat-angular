import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  templateUrl: './loading-skeleton.component.html',
  styleUrl: './loading-skeleton.component.scss',
})
export class LoadingSkeletonComponent {
  @Input() width = '100%';
  @Input() height = '16px';
  @Input() borderRadius = '4px';
}
