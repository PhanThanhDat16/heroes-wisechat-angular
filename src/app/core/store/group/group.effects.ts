import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { GroupService } from "../../../features/chat/service/group.service";
import { ToastService } from "angular-toastify";
import { loadGroup } from "./group.actions";
import { switchMap } from "rxjs";

@Injectable()
export class GroupEffect {
    constructor(
        private action$: Actions,
        private groupService: GroupService,
        private toastService: ToastService
      ) {}

    // loadGroup$ = createEffect(() => this.action$.pipe(
    //     ofType(loadGroup),
    //     switchMap(() =>
    //             this.groupService.getGroupsByUser().pipe(
    //               map((heroes) => loadHeroesSuccess({ heroes })),
    //               catchError(({ error }) => {
    //                 this.toastService.error(error.message);
    //                 return of(loadHeroesFailure({ error }));
    //               })
    //             )
    //           )
    // ))
}