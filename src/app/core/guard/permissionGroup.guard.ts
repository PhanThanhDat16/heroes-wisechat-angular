import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';
import { of, Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { GroupServiceAPI } from '../../features/group/service/groupAPI.service';
import { ToastService } from 'angular-toastify';

export const permissionGroupGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
): Observable<boolean | UrlTree> => {
  const groupService = inject(GroupServiceAPI);
  const router = inject(Router);
  const toast = inject(ToastService);
  const groupId = route.params['id'];
  return groupService.verifyGroupDetail(groupId).pipe(
    map((res) => {
      if (res?.access === true) {
        return true;
      } else {
        toast.error('You do not have access to this group');
        return router.createUrlTree(['/messages']);
      }
    }),
    catchError(() => {
      toast.error('Error checking permissions');
      return of(router.createUrlTree(['/messages']));
    }),
    take(1)
  );
};
