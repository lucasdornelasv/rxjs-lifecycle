import { Observable, Subscription } from "rxjs";

export function onSubscribe<T>(consumer: (subscription: Subscription) => void) {
	return (source: Observable<T>): Observable<T> => {
		return new Observable<T>((subscriber) => {
			consumer(subscriber);
			return source.subscribe(subscriber);
		});
	};
}
