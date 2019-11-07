import {
  Operator,
  Subscriber,
  TeardownLogic,
  Observable,
  MonoTypeOperatorFunction,
  Subscription
} from 'rxjs';

class OnSubscribeSubscriber<T, E> extends Subscriber<T> {
  constructor(
    destination: Subscriber<T>,
    consumer: (subscription: Subscription) => void
  ) {
    super(destination);
    consumer(this);
  }
}

class OnSubscribeOperator<T, E> implements Operator<T, T> {
  constructor(private consumer: (subscription: Subscription) => void) {}

  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    return source.subscribe(
      new OnSubscribeSubscriber(subscriber, this.consumer)
    );
  }
}

export function onSubscribe<T>(
  consumer: (subscription: Subscription) => void
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    source.lift(new OnSubscribeOperator(consumer));
}
