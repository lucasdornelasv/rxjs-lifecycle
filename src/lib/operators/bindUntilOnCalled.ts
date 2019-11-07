import { MonoTypeOperatorFunction } from 'rxjs';
import { bindUntilEvent } from './bindUntilEvent';
import { ObservableMethod } from '../observables/observable-method';

export function bindUntilOnMethodCalled<T, C>(
  objToWatch: C,
  methodName: keyof C
): MonoTypeOperatorFunction<T> {
  return source =>
    source.pipe(
      bindUntilEvent(new ObservableMethod(objToWatch, methodName), 1)
    );
}
