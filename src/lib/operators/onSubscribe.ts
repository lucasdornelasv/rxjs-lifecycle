import {
	Operator,
	Subscriber,
	TeardownLogic,
	Observable,
	OperatorFunction,
	Subscription,
} from "rxjs";

class OnSubscribeSubscriber<T> extends Subscriber<T> {
	constructor(destination: Subscriber<T>, consumer: (subscription: Subscription) => void) {
		super(destination);
		consumer(this);
	}
}

class OnSubscribeOperator<T> implements Operator<T, T> {
	constructor(private consumer: (subscription: Subscription) => void) {}

	call(subscriber: Subscriber<T>, source: any): TeardownLogic {
		return source.subscribe(new OnSubscribeSubscriber(subscriber, this.consumer));
	}
}

export function onSubscribe<T>(
	consumer: (subscription: Subscription) => void
): OperatorFunction<T, T> {
	return (source: Observable<T>) => source.lift(new OnSubscribeOperator(consumer));
}
