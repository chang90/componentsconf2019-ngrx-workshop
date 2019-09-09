import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { BooksService } from "../shared/services/book.service";
import { BooksPageActions, BooksApiActions } from "./actions";
import { exhaustMap, concatMap, map, catchError, mergeMap } from "rxjs/operators";
import { EMPTY, of } from "rxjs";


@Injectable()
export class BooksEffects {
  constructor(
    private actions$: Actions,
    private booksService: BooksService) {
  }

  @Effect() LoadBooks$ = this.actions$.pipe(
    ofType(BooksPageActions.enter),
    exhaustMap(() =>
      this.booksService.all().pipe(
        map((books: any) => BooksApiActions.booksLoaded({ books })),
        catchError(() => EMPTY)
      )
    )
  );

  @Effect() createBook$ = this.actions$.pipe(
    ofType(BooksPageActions.createBook),
    concatMap((action) =>
      this.booksService.create(action.book).pipe(
        map((book: any) => BooksApiActions.bookCreated({ book })),
        catchError(() => EMPTY)
      )
    )
  );

  @Effect() updateBook$ = this.actions$.pipe(
    ofType(BooksPageActions.updateBook),
    concatMap((action) =>
      this.booksService.update(action.bookId, action.changes).pipe(
        map((book: any) => BooksApiActions.bookUpdated({ book })),
        catchError(() => EMPTY)
      )
    )
  );

  @Effect() deleteBook$ = this.actions$.pipe(
    ofType(BooksPageActions.deleteBook),
    mergeMap((action) =>
      this.booksService.delete(action.bookId).pipe(
        map((book: any) => BooksApiActions.bookDeleted({ bookId: action.bookId })),
        catchError((error) => {
          console.log(error);
          return EMPTY;
          // return of(
          // BooksPageActions.createFailure({
          // error,
          // action.bookId
        })
      )
    )
  );

  // @Effect() tick$ = interval().pipe(...)


  // @Effect() = fromWebSocket('ws').pipe(...)

}