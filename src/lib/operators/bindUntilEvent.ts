import { Observable, MonoTypeOperatorFunction } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

export function bindUntilEvent<T, E>(
  lifecycle: Observable<E>,
  event: E
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    source.pipe(takeUntil(lifecycle.pipe(first(value => value === event))));
}
