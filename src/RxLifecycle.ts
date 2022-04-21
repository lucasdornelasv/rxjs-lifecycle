import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { catchError, filter, first, map, share, skip, take, takeUntil } from "rxjs/operators";
import { EventMappingHandler } from "./EventMappingHandler";
import { Functions } from "./Functions";
import { ILifecycleProvider } from "./ILifecycleProvider";
import { LifecycleTransform } from "./LifecycleTransform";

export class RxLifecycle<R> implements ILifecycleProvider<R> {
	private readonly _subject: Subject<R>;

	public static bindUntilEvent<E, T>(lifecycle: Observable<E>, event: E): LifecycleTransform<T> {
		return RxLifecycle.bind<E, T>(RxLifecycle.takeUntilEvent(lifecycle, event));
	}

	public static bind<E, T>(
		lifecycle: Observable<E>,
		correspondingEvents?: EventMappingHandler<E>
	): LifecycleTransform<T> {
		let observable: Observable<any>;
		if (correspondingEvents) {
			observable = RxLifecycle.takeUntilCorrespondingEvent<E>(
				lifecycle.pipe(share()),
				correspondingEvents
			);
		} else {
			observable = lifecycle.pipe(first());
		}

		return takeUntil(observable);
	}

	private static takeUntilEvent<E>(lifecycle: Observable<E>, event: E) {
		return lifecycle.pipe(first((lifecycleEvent) => lifecycleEvent === event));
	}

	private static takeUntilCorrespondingEvent<E>(
		lifecycle: Observable<E>,
		correspondingEvents: EventMappingHandler<E>
	) {
		return combineLatest(
			lifecycle.pipe(take(1), map(correspondingEvents)),
			lifecycle.pipe(skip(1))
		).pipe(
			map(([bindUntilEvent, lifecycleEvent]) => {
				return bindUntilEvent === lifecycleEvent;
			}),
			catchError(Functions.RESUME_FUNCTION),
			first(Functions.SHOULD_COMPLETE)
		);
	}

	constructor(private readonly correspondingEvents?: EventMappingHandler<R>, initialEvent?: R) {
		this._subject = new BehaviorSubject<R>(initialEvent);
	}

	lifecycle(): Observable<R> {
		return this._subject.asObservable();
	}

	bindUntilEvent<T>(event: R): LifecycleTransform<T> {
		return RxLifecycle.bindUntilEvent<R, T>(this._subject, event);
	}

	bindToLifecycle<T>(): LifecycleTransform<T> {
		return RxLifecycle.bind(this._subject, this.correspondingEvents);
	}

	next(event: R): void {
		this._subject.next(event);
	}
}
